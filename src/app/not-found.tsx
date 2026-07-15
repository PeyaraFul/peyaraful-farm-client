import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-emerald-deep">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <p className="mt-2 text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-6 py-3 bg-emerald-deep text-white rounded-lg hover:bg-emerald-bright transition font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
