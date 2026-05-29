import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Movie } from '../types';
import { getBackdropUrl, getReleaseYear, getRating } from '../utils/helpers';
import { AiFillStar } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';


interface HeroBannerProps {
  movie: Movie;
}

function HeroBanner({ movie }: HeroBannerProps) {
  const { addToList, removeFromList, isInList } = useAppContext();
  const saved = isInList(movie.id);

  const backdropUrl = getBackdropUrl(movie.poster_path);
  const releaseYear = getReleaseYear(movie.release_date);

  const handleListClick = () => {
    if (saved) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  return (
    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[440px] lg:h-[520px] mb-8 md:mb-10 overflow-hidden">
      {/* Backdrop image */}
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-[#1a0a2e] to-[#0d1b2a]" />
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-transparent to-transparent" />

      {/* Content */}
       <div className="absolute inset-0 flex items-center px-4 sm:px-6 md:px-8">
        <div className="max-w-xs sm:max-w-sm md:max-w-lg">

          {/* Trending badge */}
           <div className="flex items-center gap-2 mb-2 md:mb-4">
            <span className="bg-[#E63946] text-white text-[10px] md:text-xs font-medium px-2 md:px-3 py-0.5 md:py-1 rounded-sm">
              🔥 Trending Now
            </span>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 leading-tight line-clamp-2">
            {movie.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
            <span className="text-white/50 text-xs md:text-sm">{releaseYear}</span>
            <div className="flex items-center gap-1">
              <AiFillStar className="text-yellow-400 text-xs md:text-sm" />
              <span className="text-yellow-400 text-xs md:text-sm font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Overview — hidden on small mobile */}
          <p className="hidden sm:block text-white/60 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-3">
            {movie.overview}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to={`/movie/${movie.id}`}
              className="flex items-center gap-1 md:gap-2 bg-[#E63946] hover:bg-[#E63946]/80 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200"
            >
              More Info
            </Link>
            <button
              onClick={handleListClick}
              className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium border transition-colors duration-200 ${
                saved
                  ? 'bg-[#E63946]/10 border-[#E63946] text-[#E63946]'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {saved ? <BsBookmarkFill /> : <BsBookmark />}
              <span className="hidden sm:block">
                {saved ? 'Saved' : 'Add to List'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default HeroBanner;
