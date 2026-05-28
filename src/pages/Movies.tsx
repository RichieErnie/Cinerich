import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getMoviesByGenre,
  getGenres,
  searchMovies,
  getDiscoverMovies,
  getNowPlaying,
} from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import useDebounce from '../hooks/useDebounce';
import SearchDropdown from '../components/SearchDropdown';
import type { Movie, Genre } from '../types';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

function Movies() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get('sort') || 'popularity.desc',
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [loading, setLoading] = useState(true);

  // Fetch genres once on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await getGenres();
        setGenres(res.data.genres);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies when filters change
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        let res;

        if (searchQuery.trim() !== '') {
          res = await searchMovies(searchQuery, page);
        } else if (sortBy === 'now_playing') {
          res = await getNowPlaying(page);
        } else if (selectedGenre) {
          res = await getMoviesByGenre(selectedGenre, page, sortBy);
        } else {
          res = await getDiscoverMovies(page, sortBy);
        }

        setMovies(res.data.results);
        setTotalPages(res.data.total_pages > 500 ? 500 : res.data.total_pages);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery, selectedGenre, page, sortBy]);

  // useEffect for suggestions
  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setSuggesting(true);
        const res = await searchMovies(debouncedSearchQuery, 1);
        setSuggestions(res.data.results.slice(0, 6));
      } catch (err) {
        console.error('Suggestion failed:', err);
      } finally {
        setSuggesting(false);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchQuery]);

  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
    setPage(1);
    setSearchQuery('');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
    setSelectedGenre(null);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  function handleClearFilters() {
    setSelectedGenre(null);
    setSearchQuery('');
    setPage(1);
  }

  const getSortLabel = () => {
    if (sortBy === 'popularity.desc') return 'Popular Movies';
    if (sortBy === 'vote_average.desc') return 'Highest Rated Movies';
    if (sortBy === 'primary_release_date.desc') return 'Newest Movies';
    if (sortBy === 'now_playing') return 'Now Playing';
    return 'Popular Movies';
  };

  const getGenreLabel = () => {
    const genreName = genres.find((g) => g.id === selectedGenre)?.name;
    return genreName ? `${genreName} Movies` : '';
  };

  const getSearchLabel = () => {
    const sortLabel =
      sortBy === 'popularity.desc'
        ? 'Most Popular'
        : sortBy === 'vote_average.desc'
          ? 'Highest Rated'
          : 'Newest First';

    return `Results for "${searchQuery}" • ${sortLabel}`;
  };

  const getSortedMovies = () => {
    const sorted = [...movies];

    if (sortBy === 'vote_average.desc') {
      return sorted.sort((a, b) => b.vote_average - a.vote_average);
    }

    if (sortBy === 'primary_release_date.desc') {
      return sorted.sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      );
    }

    return sorted;
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Movies</h1>
          <p className="text-white/40 text-xs md:text-sm">Discover your next favourite film</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 md:px-4 py-2">
            <AiOutlineSearch className="text-white/40 text-sm flex-shrink-0" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => {
                handleSearch(e);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="bg-transparent outline-none text-xs md:text-sm text-white placeholder-white/30 w-full"
            />
          </div>
          {showDropdown && searchQuery && (
            <SearchDropdown
              results={suggestions}
              query={searchQuery}
              loading={suggesting}
              onClose={() => setShowDropdown(false)}
              onViewAll={() => setShowDropdown(false)}
            />
          )}
        </div>
      </div>

      <div className="flex gap-4 md:gap-6">

        {/* Sidebar — hidden on mobile */}
        <div className="hidden md:block w-44 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white">Filters</h3>
              {(selectedGenre || searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-[#E63946] hover:text-[#E63946]/80"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Genres</p>
              <div className="flex flex-col gap-1">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreClick(genre.id)}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors duration-200 ${
                      selectedGenre === genre.id
                        ? 'bg-[#E63946] text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Mobile genre pills */}
          <div className="md:hidden flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
            {(selectedGenre || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-[#E63946] text-[#E63946]"
              >
                Clear ✕
              </button>
            )}
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                  selectedGenre === genre.id
                    ? 'bg-[#E63946] border-[#E63946] text-white'
                    : 'border-white/15 text-white/50 hover:text-white'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>

          {/* Sort row */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <p className="text-xs md:text-sm text-white/40 truncate mr-2">
              {searchQuery
                ? getSearchLabel()
                : selectedGenre
                ? getGenreLabel()
                : getSortLabel()}
            </p>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="flex-shrink-0 bg-[#16161f] border border-white/10 text-white text-xs md:text-sm rounded-lg px-2 md:px-3 py-1.5 md:py-2 outline-none cursor-pointer"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Newest First</option>
              <option value="now_playing">Now Playing</option>
            </select>
          </div>

          {/* Movies grid */}
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-24">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">🎬</div>
              <p className="text-white/50 text-xs md:text-sm">No movies found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
              {getSortedMovies().map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 md:mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs md:text-sm disabled:opacity-30 hover:bg-white/10 transition-colors duration-200"
              >
                Previous
              </button>
              <span className="text-white/40 text-xs md:text-sm px-2 md:px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs md:text-sm disabled:opacity-30 hover:bg-white/10 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Movies;
