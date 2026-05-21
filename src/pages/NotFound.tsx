import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back home
      </Link>
    </div>
  );
}
