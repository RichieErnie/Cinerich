import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import type { Movie } from '../types';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  loading: boolean;
  viewAllPath: string;
}

function MovieRow({ title, movies, loading, viewAllPath }: MovieRowProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 mb-3 md:mb-4">
        <h2 className="text-sm sm:text-base md:text-lg font-medium text-white">{title}</h2>
        <span
          onClick={() => navigate(viewAllPath)}
          className="text-xs md:text-sm text-[#E63946] cursor-pointer hover:text-[#E63946]/80 transition-colors duration-200"
        >
          View All →
        </span>
      </div>

      {loading ? (
        <div className="flex gap-2 md:gap-3 px-4 sm:px-6 md:px-8 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] aspect-[2/3] rounded-lg bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 md:gap-3 px-4 sm:px-6 md:px-8 overflow-x-auto scrollbar-hide">
          {movies.map((movie) => (
            <div key={movie.id} className="shrink-0 w-[120px] sm:w-[140px] md:w-[160px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieRow;