export const dynamic = 'force-dynamic';

export default function BlockedPage ()
{
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="bg-white border border-red-300 p-8 rounded-lg shadow text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-4">🚫 You are banned!</h1>
        <p className="text-gray-700">You are banned becuase we think you are engaging skechy activities, contact us if you need help.</p>
      </div>
    </div>
  );
}
