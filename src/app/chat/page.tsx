import { ChatComponent } from '@/app/components/ChatComponent';
import { PanelWorkspace } from '@/app/components/PanelWorkspace';
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
        <PanelWorkspace>
          <PanelWorkspace.Slide ariaLabel="Meetings">
            <MeetingsList />
          </PanelWorkspace.Slide>
          <PanelWorkspace.Slide ariaLabel="Chat">
            <ChatComponent />
          </PanelWorkspace.Slide>
        </PanelWorkspace>
      </HydrationBoundary>
    </main>
  );
}
