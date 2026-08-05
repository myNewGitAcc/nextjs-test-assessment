import { queryOptions } from '@tanstack/react-query';

export type Meeting = {
  id: number;
  title: string;
  date: string;
  status: string;
};

type MeetingsResponse = {
  meetings: Meeting[];
};

const meetingsQueryKey = ['meetings'] as const;

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function getMeetingsUrl() {
  if (typeof window === 'undefined') {
    return `${baseUrl}/api/meetings`;
  }

  return '/api/meetings';
}

async function fetchMeetings(): Promise<Meeting[]> {
  const response = await fetch(getMeetingsUrl(), { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch meetings');
  }

  const data: MeetingsResponse = await response.json();
  return data.meetings;
}

export const meetingsQueryOptions = queryOptions({
  queryKey: meetingsQueryKey,
  queryFn: fetchMeetings,
});
