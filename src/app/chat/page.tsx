import { ChatComponent } from '@/app/components/ChatComponent';
import MeetingsList from '@/app/components/MeetingsList';
import { getQueryClient } from '@/lib/get-query-client';
import { meetingsQueryOptions } from '@/queries/meetings';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function ChatPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(meetingsQueryOptions);

  return (
    <main className="flex h-full min-h-0 w-full flex-1 flex-col p-6">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex justify-center min-h-0 h-full w-full flex-1">
          <MeetingsList />
          <div
            role="separator"
            aria-orientation="vertical"
            className="mx-4 w-px shrink-0 self-stretch bg-neutral-300"
          />
          <ChatComponent />
        </div>
      </HydrationBoundary>
    </main>
  );
}
