export interface Movie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;        
  video: boolean;        
}

export interface MovieDetails extends Movie {
  runtime: number;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  imdb_id: string;
  genres: Genre[];
  origin_country: string[];
}

export interface Genre {
  id: number;
  name: string;
}


export interface Cast {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string;
  adult: boolean;
  gender: number;
  known_for_department: string;
  popularity: number;
  cast_id: number;
  credit_id: string;
  order: number;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export interface Crew {
  id: number;
  name: string;
  job: string;
}

