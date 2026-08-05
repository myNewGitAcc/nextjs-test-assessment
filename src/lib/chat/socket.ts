import type { WireMessage } from '@/lib/chat/types';

// validate echo payload shape; ignore errors
export function parseWireMessage(raw: string): WireMessage | null {
  try {
    const data = JSON.parse(raw) as WireMessage;
    if (typeof data?.id === 'string' && typeof data?.text === 'string') {
      return data;
    }
  } catch {
    // ignore malformed payloads
  }
  return null;
}

export function closeSocket(ws: WebSocket | null) {
  if (!ws) {
    return;
  }

  ws.onmessage = null;
  ws.onerror = null;
  ws.onclose = null;

  if (ws.readyState === WebSocket.CONNECTING) {
    ws.onopen = () => ws.close();
    return;
  }

  ws.onopen = null;

  if (ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
}
