import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGE_BASE_URL } from '../api/tmdb';
import type { Movie } from '../types';
import { AiFillStar } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';

interface SearchDropdownProps {
  results: Movie[];
  query: string;
  loading: boolean;
  onClose: () => void;
  onViewAll: () => void;
}

function SearchDropdown({
  results,
  query,
  loading,
  onClose,
  onViewAll,
}: SearchDropdownProps) {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
    onClose();
  };

  const releaseYear = (date: string) => (date ? date.split('-')[0] : 'N/A');

  if (!query.trim()) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#16161f] shadow-2xl"
    >
      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col gap-2 p-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="h-12 w-8 shrink-0 animate-pulse rounded-md bg-white/5" />
              <div className="flex-1">
                <div className="mb-2 h-3 w-3/4 animate-pulse rounded bg-white/5" />
                <div className="h-2 w-1/4 animate-pulse rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        // Empty
        <div className="flex flex-col items-center justify-center px-4 py-8">
          <BsSearch className="mb-3 text-3xl text-white/20" />
          <p className="text-sm text-white/40">No results for "{query}"</p>
        </div>
      ) : (
        // Results
        <div>
          <div className="border-b border-white/5 px-4 py-2">
            <p className="text-xs tracking-widest text-white/30 uppercase">
              Results for "{query}"
            </p>
          </div>

          <div className="max-h-100 overflow-y-auto">
            {results.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className="flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-3 transition-colors duration-150 last:border-0 hover:bg-white/5"
              >
                {/* Small poster */}
                <div className="h-12 w-8 shrink-0 overflow-hidden rounded-md bg-white/5">
                  {movie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-white/20">
                      🎬
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {movie.title}
                  </p>
                  <p className="text-xs text-white/40">
                    {releaseYear(movie.release_date)}
                  </p>
                </div>

                {/* Rating */}
                {movie.vote_average > 0 && (
                  <div className="flex shrink-0 items-center gap-1">
                    <AiFillStar className="text-xs text-yellow-400" />
                    <span className="text-xs text-white/50">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View all results */}
          <div
            onClick={onViewAll}
            className="flex cursor-pointer items-center justify-center gap-2 border-t border-white/5 px-4 py-3 transition-colors duration-150 hover:bg-white/5"
          >
            <BsSearch className="text-sm text-[#E63946]" />
            <p className="text-sm font-medium text-[#E63946]">
              See all results for "{query}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchDropdown;
