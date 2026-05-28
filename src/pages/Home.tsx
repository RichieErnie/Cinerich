import { useQueries } from '@tanstack/react-query';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlaying,
} from '../api/tmdb';
import type { Movie } from '../types';


function Home() {

  const results = useQueries({
    queries: [
      {
        queryKey: ['trending'],
       queryFn: () => getTrending(),
       
      },
      {
        queryKey: ['popular'],
        queryFn: () => getPopular(),
      },
      {
        queryKey: ['topRated'],
        queryFn: () => getTopRated(),
      },
      {
        queryKey: ['nowPlaying'],
        queryFn: () => getNowPlaying(),
      },
    ],
  });

  const [trendingQ, popularQ, topRatedQ, nowPlayingQ] = results;
  const loading = results.some((r) => r.isLoading);


  const trending: Movie[] = (trendingQ.data as any)?.data?.results ?? [];
  const popular: Movie[] = (popularQ.data as any)?.data?.results ?? [];
  const topRated: Movie[] = (topRatedQ.data as any)?.data?.results ?? [];
  const nowPlaying: Movie[] = (nowPlayingQ.data as any)?.data?.results ?? [];

  return (
    <div>
      {/* Hero Banner */}
      {trending.length > 0 && <HeroBanner movie={trending[0]} />}

      {/* Movie Rows */}
      <MovieRow
        title="🔥 Trending Now"
        movies={trending}
        loading={loading}
        viewAllPath="/movies?sort=popularity.desc"
      />
      <MovieRow
        title="🎬 Popular Movies"
        movies={popular}
        loading={loading}
        viewAllPath="/movies?sort=popularity.desc"
      />
      <MovieRow
        title="▶️ Now Playing"
        movies={nowPlaying}
        loading={loading}
        viewAllPath="/movies?sort=now_playing"
      />
      <MovieRow
        title="⭐ Top Rated"
        movies={topRated}
        loading={loading}
        viewAllPath="/movies?sort=vote_average.desc"
      />
    </div>
  );
}

export default Home;
