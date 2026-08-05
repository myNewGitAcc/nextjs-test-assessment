'use client';

import { MessageRow } from '@/app/components/chat/MessageRow';
import { statusLabel } from '@/app/components/getStatusLabel';
import { useChatFeatures } from '@/lib/chat';
import clsx from 'classnames';
import type { KeyboardEvent, SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

export function ChatComponent() {
  const { messages, status, sendMessage, retryMessage } = useChatFeatures();
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // scroll dialog down while new message appear
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
    setDraft('');
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      if (!draft.trim()) {
        return;
      }
      sendMessage(draft);
      setDraft('');
    }
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden h-full">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3 bg-(--page-bg)">
        <h1 className="text-heading">Chat with consultant</h1>
        <p
          className={clsx('text-sm', {
            'text-red-500': status === 'disconnected',
            'text-amber-600': status === 'connecting',
            'text-emerald-600': status === 'connected',
          })}
          aria-live="polite"
        >
          {statusLabel(status)}
        </p>
      </div>

      <ul
        ref={listRef}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto py-2"
      >
        {messages.length === 0 ? (
          <li className="text-sm text-neutral-500">Send a message</li>
        ) : (
          messages.map((message) => (
            <MessageRow
              key={message.id}
              message={message}
              onRetry={retryMessage}
            />
          ))
        )}
      </ul>

      <form
        onSubmit={handleSubmit}
        className="mt-3 flex shrink-0 gap-2 border-t border-neutral-300 pt-3"
      >
        <textarea
          value={draft}
          cols={2}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleComposerKeyDown}
          placeholder="Message…"
          className="min-w-0 flex-1 rounded border border-neutral-300 bg-transparent px-3 py-2 resize-none"
          aria-label="Message text"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="rounded border border-neutral-300 px-3 py-2 text-sm disabled:opacity-50 cursor-pointer"
        >
          Send
          <br />
          (ctrl+enter)
        </button>
      </form>
    </div>
  );
}
