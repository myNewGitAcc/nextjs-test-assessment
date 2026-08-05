'use client';

import { closeSocket, parseWireMessage } from '@/lib/chat/socket';
import type {
  ChatMessage,
  ConnectionStatus,
  WireMessage,
} from '@/lib/chat/types';
import { useEffect, useRef, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8081';
const RECONNECT_MS = 5000;

export function useChatFeatures() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  const messagesRef = useRef(messages);
  const wsRef = useRef<WebSocket | null>(null);
  // lets the socket effect call the latest resend helper without reconnecting
  const resendFailedRef = useRef<typeof resendFailed>(() => {});

  messagesRef.current = messages;

  const isOpen = () => wsRef.current?.readyState === WebSocket.OPEN;

  const sendWire = (message: Pick<ChatMessage, 'id' | 'text'>) => {
    if (!isOpen()) {
      return false;
    }

    wsRef.current!.send(
      JSON.stringify({
        id: message.id,
        text: message.text,
      } satisfies WireMessage),
    );
    return true;
  };

  // Resend failed messages (one id, or all). Used on reconnect and retry UI
  const resendFailed = (id?: string) => {
    if (!isOpen()) {
      return;
    }

    const failed = messagesRef.current.filter(
      (message) =>
        message.role === 'user' &&
        message.status === 'failed' &&
        (!id || message.id === id),
    );

    if (failed.length === 0) {
      return;
    }

    setMessages((prev) =>
      prev.map((message) =>
        failed.some((item) => item.id === message.id)
          ? { ...message, status: 'pending' }
          : message,
      ),
    );

    for (const message of failed) {
      if (!sendWire(message)) {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === message.id ? { ...item, status: 'failed' } : item,
          ),
        );
      }
    }
  };

  resendFailedRef.current = resendFailed;

  useEffect(() => {
    let disposed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (disposed) {
        return;
      }

      // avoid the previous socket's onclose scheduling an extra reconnect
      const previous = wsRef.current;
      wsRef.current = null;
      closeSocket(previous);

      setStatus('connecting');

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (disposed || wsRef.current !== ws) {
          // replaced or unmounted while handshake was in flight
          ws.close();
          return;
        }

        setStatus('connected');
        resendFailedRef.current();
      };

      ws.onmessage = (event) => {
        if (disposed || wsRef.current !== ws) {
          return;
        }

        const wire = parseWireMessage(String(event.data));
        if (!wire) {
          return;
        }

        setMessages((prev) => {
          // already handled this echo
          if (prev.some((message) => message.id === `echo-${wire.id}`)) {
            return prev;
          }

          return [
            ...prev.map((message) =>
              message.id === wire.id
                ? { ...message, status: 'sent' as const }
                : message,
            ),
            {
              id: `echo-${wire.id}`,
              text: wire.text,
              role: 'consultant' as const,
              status: 'sent' as const,
              createdAt: Date.now(),
            },
          ];
        });
      };

      ws.onclose = () => {
        if (disposed || wsRef.current !== ws) {
          return;
        }

        wsRef.current = null;
        setMessages((prev) =>
          prev.map((message) =>
            message.role === 'user' && message.status === 'pending'
              ? { ...message, status: 'failed' }
              : message,
          ),
        );
        setStatus('disconnected');
        reconnectTimer = setTimeout(connect, RECONNECT_MS);
      };
    };

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      const ws = wsRef.current;
      wsRef.current = null;
      closeSocket(ws);
    };
  }, []);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const connected = isOpen();
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text: trimmed,
      role: 'user',
      status: connected ? 'pending' : 'failed',
      createdAt: Date.now(),
    };

    // optimistic update
    setMessages((prev) => [...prev, message]);

    if (connected && !sendWire(message)) {
      setMessages((prev) =>
        prev.map((item) =>
          item.id === message.id ? { ...item, status: 'failed' } : item,
        ),
      );
    }
  };

  return {
    messages,
    status,
    sendMessage,
    retryMessage: (id: string) => resendFailed(id),
  };
}
