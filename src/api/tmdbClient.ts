import { TMDB } from 'tmdb-ts';

const tmdb = new TMDB(import.meta.env.VITE_TMDB_ACCESS_TOKEN);

export default tmdb;