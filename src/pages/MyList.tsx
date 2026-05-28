import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MovieCard from '../components/MovieCard';

function MyList() {
  const { myList } = useAppContext();

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My List</h1>
          <p className="text-white/40 text-xs md:text-sm">
            {myList.length} {myList.length === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>
      </div>

      {myList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
          <div className="text-5xl md:text-6xl mb-3 md:mb-4">🎬</div>
          <h2 className="text-lg md:text-xl font-medium text-white mb-2">
            Your list is empty
          </h2>
          <p className="text-white/40 text-xs md:text-sm mb-4 md:mb-6">
            Start adding movies you want to watch
          </p>
          <Link
            to="/"
            className="bg-[#E63946] hover:bg-[#E63946]/80 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {myList.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyList;