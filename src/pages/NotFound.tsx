import { Link } from 'react-router-dom';
import { MdLocalMovies } from 'react-icons/md';

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <MdLocalMovies className="mb-6 text-8xl text-[#E63946] opacity-50" />
      <h1 className="mb-4 text-8xl font-bold text-white">404</h1>
      <h2 className="mb-3 text-2xl font-medium text-white">Page Not Found</h2>
      <p className="mb-8 max-w-md text-sm text-white/40">
        The page you are looking for does not exist or has been moved.
      </p>
        <Link
        to="/"
        className="flex items-center gap-2 bg-[#E63946] hover:bg-[#E63946]/80 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;