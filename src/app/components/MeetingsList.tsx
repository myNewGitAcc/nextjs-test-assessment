'use client';

import { formatMeetingDate } from '@/app/utils/formatMeetingDate';
import { meetingsQueryOptions } from '@/queries/meetings';
import { useQuery } from '@tanstack/react-query';
import clsx from 'classnames';

export default function MeetingsList() {
  const { data, error, isFetching, refetch } = useQuery(meetingsQueryOptions);

  return (
    <section className="relative flex h-full min-h-0 w-full shrink-0 flex-col overflow-y-auto">
      <div className="sticky top-0 mb-3 flex shrink-0 items-center justify-between gap-3 bg-(--page-bg)">
        <h2 className="text-heading">Meetings</h2>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-22.5 rounded border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {isFetching ? 'Updating…' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-red-500">
          Failed to load meetings.
        </p>
      ) : !data?.length ? (
        <p className="text-sm text-neutral-500">No meetings yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {data.map((meeting) => (
            <li
              key={meeting.id}
              className="border-b border-neutral-200 py-2 tablet:max-w-60"
            >
              <p className="font-medium">{meeting.title}</p>
              <p className="text-sm text-neutral-600">
                {formatMeetingDate(meeting.date)} ·{' '}
                <span
                  className={clsx({
                    'text-emerald-600': meeting.status === 'completed',
                    'text-amber-600': meeting.status === 'scheduled',
                    'text-red-500': meeting.status === 'cancelled',
                  })}
                >
                  {meeting.status}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
