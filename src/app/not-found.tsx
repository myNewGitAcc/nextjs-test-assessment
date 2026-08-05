import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grow flex flex-col justify-center">
      <h1 className="text-heading">Page not found</h1>
      <div>
        <span>Visit</span>{' '}
        <Link href="/chat" replace>
          /chat
        </Link>{' '}
        <span>page</span>
      </div>
    </main>
  );
}
