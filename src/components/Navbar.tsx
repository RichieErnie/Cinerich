import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { useAppContext } from '../context/AppContext';
import { MdLocalMovies } from 'react-icons/md';
import { searchMovies } from '../api/tmdb';
import SearchDropdown from './SearchDropdown';
import useDebounce from '../hooks/useDebounce';
import type { Movie } from '../types';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { myList } = useAppContext();

  // Search state
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const isActive = (path: string) => location.pathname === path;

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setSearching(true);
        const res = await searchMovies(debouncedQuery, 1);
        setResults(res.data.results.slice(0, 6));
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      navigate(`/movies?search=${query.trim()}`);
      setQuery('');
      setResults([]);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const handleViewAll = () => {
    navigate(`/movies?search=${query.trim()}`);
    setQuery('');
    setResults([]);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  const handleClose = () => {
    setResults([]);
    setQuery('');
    setIsSearchOpen(false);
  };

  const handleClearSearch = () => {
    setQuery('');
    setIsSearchOpen(false);
  };

 return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 text-lg md:text-xl font-semibold">
            <MdLocalMovies className="text-[#E63946] text-xl md:text-2xl" />
            <span className="text-white">Cine</span>
            <span className="text-[#E63946]">Rich</span>
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm transition-colors duration-200 ${
                isActive('/') ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              Home
            </Link>
            {/* Testing home for git */}
            <Link
              to="/"
              className={`text-sm transition-colors duration-200 ${
                isActive('/') ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              Testing Home
            </Link>
            <Link
              to="/movies"
              className={`text-sm transition-colors duration-200 ${
                isActive('/movies') ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              Movies
            </Link>
            <Link
              to="/mylist"
              className={`relative text-sm transition-colors duration-200 ${
                isActive('/mylist') ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              My List
              {myList.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-[#E63946] text-white text-[10px] font-medium min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {myList.length > 9 ? '9+' : myList.length}
                </span>
              )}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Desktop search */}
            <div className="hidden md:block relative">
              {isSearchOpen ? (
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/20 rounded-full px-4 py-2 w-72">
                    <AiOutlineSearch className="text-white/40 text-base flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search movies... (Enter)"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      onBlur={() => { if (query === '') setIsSearchOpen(false); }}
                      autoFocus
                      className="bg-transparent outline-none text-sm text-white placeholder-white/30 w-full"
                    />
                    <AiOutlineClose
                      onClick={handleClose}
                      className="text-white/40 hover:text-white cursor-pointer text-base flex-shrink-0"
                    />
                  </div>
                  {query && (
                    <SearchDropdown
                      results={results}
                      query={query}
                      loading={searching}
                      onClose={handleClose}
                      onViewAll={handleViewAll}
                    />
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/40 hover:text-white hover:border-white/20 transition-all duration-200"
                >
                  <AiOutlineSearch className="text-base" />
                  <span className="text-sm">Search</span>
                </button>
              )}
            </div>

            {/* Mobile search icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 text-white/50 hover:text-white transition-colors duration-200"
            >
              <AiOutlineSearch className="text-lg" />
            </button>

            {/* Mobile My List icon with badge */}
            <Link
              to="/mylist"
              className="md:hidden relative flex items-center justify-center w-8 h-8 text-white/50 hover:text-white transition-colors duration-200"
            >
              <span className="text-sm">List</span>
              {myList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E63946] text-white text-[9px] font-medium min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-0.5">
                  {myList.length > 9 ? '9+' : myList.length}
                </span>
              )}
            </Link>

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 text-white/50 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen
                ? <AiOutlineClose className="text-lg" />
                : <RxHamburgerMenu className="text-lg" />
              }
            </button>
          </div>
        </div>

        {/* Mobile search bar — shows below navbar when search icon clicked */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3 relative">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              <AiOutlineSearch className="text-white/40 text-sm flex-shrink-0" />
              <input
                type="text"
                placeholder="Search movies... (Enter)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
                className="bg-transparent outline-none text-sm text-white placeholder-white/30 w-full"
              />
              <IoClose onClick={handleClearSearch} />
              {query && (
                <AiOutlineClose
                  onClick={() => { setQuery(''); setResults([]); }}
                  className="text-white/40 hover:text-white cursor-pointer text-sm flex-shrink-0"
                />
              )}
            </div>
            {query && (
              <SearchDropdown
                results={results}
                query={query}
                loading={searching}
                onClose={handleClose}
                onViewAll={handleViewAll}
              />
            )}
          </div>
        )}

        {/* Mobile menu — slides down when hamburger clicked */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/98">
            <div className="flex flex-col px-4 py-4 gap-1">
              <Link
                to="/"
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/')
                    ? 'bg-white/5 text-white font-medium'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
                {isActive('/') && <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />}
              </Link>
              <Link
                to="/movies"
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/movies')
                    ? 'bg-white/5 text-white font-medium'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                Movies
                {isActive('/movies') && <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />}
              </Link>
              <Link
                to="/mylist"
                className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors duration-200 ${
                  isActive('/mylist')
                    ? 'bg-white/5 text-white font-medium'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>My List</span>
                <div className="flex items-center gap-2">
                  {myList.length > 0 && (
                    <span className="bg-[#E63946] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {myList.length}
                    </span>
                  )}
                  {isActive('/mylist') && <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />}
                </div>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay — closes menu when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;