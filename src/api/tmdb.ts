import axios from "axios";
import {
  Movie,
  MovieDetail,
  MoviesResponse,
  FavoritesResponse,
  FavoriteRequest,
  FavoriteResponse,
} from "@/types/movie";

// TMDB API 기본 설정
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL =
  process.env.TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const ACCOUNT_ID = process.env.TMDB_ACCOUNT_ID;
const SESSION_ID = process.env.TMDB_SESSION_ID;
const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN; // Bearer 토큰 추가

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`, // 모든 요청에 인증 헤더 추가
  },
});

// 인기 영화 목록 가져오기
export const getPopularMovies = async (): Promise<MoviesResponse> => {
  const response = await api.get<MoviesResponse>("/movie/popular", {
    params: {
      language: "ko-KR", // ✅ TMDB 예시와 동일한 언어 설정
      page: 1, // ✅ 기본 페이지 번호 설정
    },
  });
  return response.data;
};

// 영화 검색하기
export const searchMovies = async (query: string): Promise<MoviesResponse> => {
  if (!query.trim()) {
    throw new Error("검색어를 입력해주세요");
  }

  const response = await api.get<MoviesResponse>("/search/movie", {
    params: {
      query,
      include_adult: false,
      language: "ko-KR",
    },
  });

  return response.data;
};

// 영화 상세 정보 가져오기
export const getMovieDetails = async (
  movieId: number
): Promise<MovieDetail> => {
  const response = await api.get<MovieDetail>(`/movie/${movieId}`, {
    params: {
      language: "ko-KR",
    },
  });

  return response.data;
};

// 즐겨찾기 추가/제거
export const toggleFavorite = async (
  movieId: number,
  isFavorite: boolean
): Promise<FavoriteResponse> => {
  const response = await api.post<FavoriteResponse>(
    `/account/${ACCOUNT_ID}/favorite`,
    {
      media_type: "movie",
      media_id: movieId,
      favorite: isFavorite,
    } as FavoriteRequest,
    {
      params: {
        session_id: SESSION_ID,
      },
    }
  );

  return response.data;
};

// 즐겨찾기 목록 가져오기
export const getFavoriteMovies = async (): Promise<FavoritesResponse> => {
  const response = await api.get<FavoritesResponse>(
    `/account/${ACCOUNT_ID}/favorite/movies`,
    {
      params: {
        session_id: SESSION_ID,
        language: "ko-KR",
        sort_by: "created_at.desc",
      },
    }
  );

  return response.data;
};

// 영화가 즐겨찾기에 있는지 확인 (최적화를 위해 즐겨찾기 목록을 캐싱하고 클라이언트에서 확인)
export const checkIfFavorite = (
  movieId: number,
  favorites: Movie[]
): boolean => {
  return favorites.some((movie) => movie.id === movieId);
};
