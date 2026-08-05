import { ChatMessage } from '@/lib/chat';
import clsx from 'classnames';
import { useEffect, useRef, useState } from 'react';

export function MessageRow({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry: (id: string) => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const prevStatusRef = useRef(message.status);
  const isUser = message.role === 'user';
  const isFailed = message.status === 'failed';
  const isPending = message.status === 'pending';

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = message.status;

    if (message.status === 'sent') {
      setIsRetrying(false);
      return;
    }

    // Retry attempt ended without an echo (e.g. disconnect).
    if (prevStatus === 'pending' && message.status === 'failed') {
      setIsRetrying(false);
    }
  }, [message.status]);

  function handleRetry() {
    setIsRetrying(true);
    onRetry(message.id);
  }

  return (
    <li
      className={clsx('flex flex-col gap-1', {
        'items-end': isUser,
        'items-start': !isUser,
      })}
    >
      <div
        className={clsx('max-w-[85%] rounded-lg px-3 py-2 text-sm', {
          'bg-sky-600 text-white': isUser,
          'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50':
            !isUser,
          'opacity-70 ring-1 ring-red-500': isFailed || isRetrying,
        })}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
      </div>
      {isUser && (
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          {isPending && !isRetrying && <span>sending…</span>}
          {(isFailed || isRetrying) && (
            <>
              <span className="text-red-500">
                {isRetrying ? 'Retrying…' : 'Not sent'}
              </span>
              <button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                className="underline disabled:hidden"
              >
                Retry
              </button>
            </>
          )}
          {message.status === 'sent' && <span>delivered</span>}
        </div>
      )}
    </li>
  );
}
