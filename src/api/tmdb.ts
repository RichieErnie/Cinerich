import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const getTrending = (page: number = 1) =>
  api.get('/trending/movie/week', { params: { page } });

export const getPopular = (page: number = 1) =>
  api.get('/movie/popular', { params: { page } });

export const getTopRated = (page: number = 1) =>
  api.get('/movie/top_rated', { params: { page } });

export const getNowPlaying = (page: number = 1) =>
  api.get('/movie/now_playing', { params: { page } });

export const getMovieDetails = (id: number) =>
  api.get(`/movie/${id}`);

export const getMovieCredits = (id: number) =>
  api.get(`/movie/${id}/credits`);

export const getSimilarMovies = (id: number) =>
  api.get(`/movie/${id}/similar`);

export const getMovieVideos = (id: number) =>
  api.get(`/movie/${id}/videos`);

export const getGenres = () =>
  api.get('/genre/movie/list');

export const searchMovies = (query: string, page: number = 1) =>
  api.get('/search/movie', { params: { query, page } });

export const getDiscoverMovies = (page: number = 1, sortBy: string = 'popularity.desc') =>
  api.get('/discover/movie', { params: { page, sort_by: sortBy } });

export const getMoviesByGenre = (genreId: number, page: number = 1, sortBy: string = 'popularity.desc') =>
  api.get('/discover/movie', {
    params: { with_genres: genreId, page, sort_by: sortBy },
  });