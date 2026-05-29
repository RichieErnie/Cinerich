import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Movie } from '../types';
import { getPosterUrl, getReleaseYear} from '../utils/helpers';
import { AiFillHeart, AiFillStar, AiOutlineHeart } from 'react-icons/ai';

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  const { addToList, removeFromList, isInList } = useAppContext();
  const saved = isInList(movie.id);

  const handleListClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = getReleaseYear(movie.release_date);

  return (
    <Link
      to={`/movie/${movie.id}`}
         className="group relative block rounded-lg overflow-hidden border border-white/5 bg-[#16161f] hover:border-white/20 transition-all duration-300"
    >
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={posterUrl}
          alt={movie.title}
        />
         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-xs font-medium border border-white/30 rounded-full px-3 py-1">
            View
          </span>
        </div>

        {/* Rating badge — only show if rating exists */}
        {movie.vote_average > 0 && (
          <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-black/70 rounded px-1.5 py-0.5">
            <AiFillStar className="text-yellow-400 text-[10px]" />
            <span className="text-yellow-400 text-[10px] font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {/* Heart button */}
        <button
          onClick={handleListClick}
          className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/70 hover:bg-black/90 transition-colors duration-200"
        >
          {saved
            ? <AiFillHeart className="text-[#E63946] text-xs" />
            : <AiOutlineHeart className="text-white/60 text-xs" />
          }
        </button>
      </div>
      {/* Info */}
      <div className="p-2 md:p-3">
        <h3 className="text-xs font-medium text-white/90 truncate mb-0.5">
          {movie.title}
        </h3>
        <p className="text-[10px] md:text-xs text-white/35">{releaseYear}</p>
      </div>
    </Link>
  );
}

export default MovieCard;