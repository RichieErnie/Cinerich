import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  IMAGE_BASE_URL,
} from '../api/tmdb';
import { useAppContext } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import {
  getPosterUrl,
  getBackdropUrl,
  getReleaseYear,
  getRuntime,
} from '../utils/helpers';
import { AiFillStar } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const { addToList, removeFromList, isInList } = useAppContext();
  const movieId = Number(id);

  const results = useQueries({
    queries: [
      {
        queryKey: ['movie', movieId],
        queryFn: () => getMovieDetails(movieId),
        enabled: !!movieId,
      },
      {
        queryKey: ['credits', movieId],
        queryFn: () => getMovieCredits(movieId),
        enabled: !!movieId,
      },
      {
        queryKey: ['similar', movieId],
        queryFn: () => getSimilarMovies(movieId),
        enabled: !!movieId,
      },
    ],
  });

  const [movieQ, creditsQ, similarQ] = results;
  const loading = movieQ.isLoading;

  const movie = movieQ.data?.data;
  const credits = creditsQ.data?.data;
  const similar = similarQ.data?.data.results?.slice(0, 12) ?? [];
  const cast = credits?.cast?.slice(0, 8) ?? [];
  const director = credits?.crew?.find((c: any) => c.job === 'Director');
  const saved = movie ? isInList(movie.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movieId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E63946] border-t-transparent" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white/50">Movie not found</p>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = getReleaseYear(movie.release_date);
  const runtime = getRuntime(movie.runtime);

  const handleListClick = () => {
    if (saved) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-100 w-full overflow-hidden">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#1a0a2e] to-[#0d1b2a]" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 -mt-20 px-4 sm:-mt-24 sm:px-6 md:-mt-32 md:px-8">
        {/* Poster + Info */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row md:mb-10 md:gap-8">
          {/* Poster */}
          <div className="flex shrink-0 justify-center sm:justify-start">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-32 rounded-xl border-2 border-white/10 shadow-2xl sm:w-40 md:w-48"
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-0 sm:pt-8 md:pt-16">
            <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl md:mb-3 md:text-4xl">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="mb-3 text-xs text-white/40 italic md:mb-4 md:text-sm">
                "{movie.tagline}"
              </p>
            )}

            {/* Meta row */}
            <div className="mb-3 flex flex-wrap items-center gap-2 md:mb-4 md:gap-4">
              <span className="text-xs text-white/50 md:text-sm">
                {releaseYear}
              </span>
              <span className="text-xs text-white/50 md:text-sm">•</span>
              <span className="text-xs text-white/50 md:text-sm">
                {runtime}
              </span>
              <span className="text-xs text-white/50 md:text-sm">•</span>
              <div className="flex items-center gap-1">
                <AiFillStar className="text-sm text-yellow-400 md:text-base" />
                <span className="text-xs font-medium text-yellow-400 md:text-sm">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-[10px] text-white/30 md:text-xs">
                  ({movie.vote_count?.toLocaleString()})
                </span>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-3 flex flex-wrap gap-1.5 md:mb-4 md:gap-2">
              {movie.genres?.map((genre: any) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/60 md:px-3 md:py-1 md:text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <p className="mb-3 max-w-2xl text-xs leading-relaxed text-white/60 md:mb-4 md:text-sm">
              {movie.overview}
            </p>

            {director && (
              <p className="mb-4 text-xs text-white/40 md:mb-6 md:text-sm">
                <span className="text-white/60">Director: </span>
                {director.name}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={handleListClick}
                className={`flex items-center gap-1 rounded-lg border px-4 py-2 text-xs font-medium transition-colors duration-200 md:gap-2 md:px-6 md:py-3 md:text-sm ${
                  saved
                    ? 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {saved ? <BsBookmarkFill /> : <BsBookmark />}
                {saved ? 'Remove from List' : 'Add to My List'}
              </button>
              {movie.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-xs font-medium text-yellow-400 transition-colors duration-200 hover:bg-yellow-400/20 md:gap-2 md:px-6 md:py-3 md:text-sm"
                >
                  IMDb Page
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast && cast.length > 0 && (
          <div className="mb-8 md:mb-10">
            <h2 className="mb-3 text-base font-medium text-white md:mb-4 md:text-lg">
              Cast
            </h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 md:gap-3">
              {cast.map((person: any) => (
                <div key={person.id} className="text-center">
                  <div className="mb-1 aspect-square w-full overflow-hidden rounded-lg bg-white/5 md:mb-2 md:rounded-xl">
                    {person.profile_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}${person.profile_path}`}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl text-white/20">
                        👤
                      </div>
                    )}
                  </div>
                  <p className="truncate text-[9px] font-medium text-white/80 md:text-xs">
                    {person.name}
                  </p>
                  <p className="truncate text-[9px] text-white/35 md:text-xs">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar movies */}
        {similar.length > 0 && (
          <div className="mb-8 md:mb-10">
            <h2 className="mb-3 text-base font-medium text-white md:mb-4 md:text-lg">
              Similar Movies
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 md:gap-3">
              {similar.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default MovieDetails;
