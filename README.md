## Consultant chat - assessment

Test assessment for a frontend developer position. Full requirements: [`task-description.md`](./task-description.md).

## Prerequisites

- [Node.js](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)
- A `.env` file in the project root (copy `.env.example` for local setup)

## Run

```bash
pnpm install
pnpm run-dev   # WebSocket echo server + Next.js
```

Then open [http://localhost:3000/chat](http://localhost:3000/chat).

Useful scripts:

```bash
pnpm server    # WebSocket echo only (default port 8081)
pnpm dev       # Next.js only
```

## What’s implemented

- **Meetings list** — loaded on the server, then kept in sync with TanStack Query; **Refresh** refetches without a full page reload
- **WebSocket chat** — messages show up immediately (optimistic); connection status is visible
- **Disconnect handling** — failed messages stay in the list, resend automatically after reconnect, or via **Retry**
- **Auto-reconnect** — no page reload needed
- **Responsive layout** — side-by-side on tablet+; swipeable panels with dots on smaller screens

## Server / client boundary

- **Server:** `/chat` page (async RSC) prefetches meetings and passes dehydrated TanStack Query state into the tree, so the list HTML is in the first response (visible with JS disabled). `GET /api/meetings` is a Route Handler.
- **Client:** anything that needs browser APIs or interaction — `MeetingsList` (Refresh), `ChatComponent` / chat hook (WebSocket, optimistic UI), `PanelWorkspace` (scroll + breakpoint), and the Query `Providers` wrapper.

The split is where interactivity starts: data for the meetings list can be prepared on the server; sockets, clicks, and local UI state cannot.
