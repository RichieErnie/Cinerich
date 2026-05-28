import { IMAGE_BASE_URL, BACKDROP_BASE_URL } from '../api/tmdb';

export const getPosterUrl = (posterPath: string | null) =>
  posterPath ? `${IMAGE_BASE_URL}${posterPath}` : '/no-image.png';

export const getBackdropUrl = (backdropPath: string | null) =>
  backdropPath ? `${BACKDROP_BASE_URL}${backdropPath}` : null;

export const getReleaseYear = (releaseDate: string | null) =>
  releaseDate ? releaseDate.split('-')[0] : 'N/A';


export const getRating = (voteAverage: number | null) =>
  voteAverage ? voteAverage.toFixed(1) : 'N/A';

export const getRuntime = (runtime: number | null) =>
  runtime ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : 'N/A';
