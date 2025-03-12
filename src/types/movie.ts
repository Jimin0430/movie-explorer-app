// 영화 기본 인터페이스
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
}

// 영화 상세 정보 인터페이스
export interface MovieDetail extends Omit<Movie, "genre_ids"> {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
}

// 영화 목록 응답 인터페이스
export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// 즐겨찾기 리스트 응답 인터페이스
export interface FavoritesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// 즐겨찾기 요청 인터페이스
export interface FavoriteRequest {
  media_type: string;
  media_id: number;
  favorite: boolean;
}

// 즐겨찾기 응답 인터페이스
export interface FavoriteResponse {
  status_code: number;
  status_message: string;
}
