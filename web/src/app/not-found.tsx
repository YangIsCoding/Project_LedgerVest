// src/app/not-found.tsx
export const dynamic = 'force-dynamic';
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold">404 – Page Not Found</h1>
      <p className="mt-2 text-gray-500">
        The page you’re looking for doesn’t exist.
      </p>
    </main>
  );
}
