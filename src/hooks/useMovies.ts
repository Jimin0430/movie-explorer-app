import { useQuery } from "@tanstack/react-query";
import { getPopularMovies, searchMovies, getMovieDetails } from "@/api/tmdb";
import { Movie, MovieDetail } from "@/types/movie";

// 인기 영화 목록을 가져오는 훅
export const usePopularMovies = () => {
  return useQuery({
    queryKey: ["popularMovies"],
    queryFn: getPopularMovies,
    staleTime: 0, // 캐시가 있어도 페이지 접근시 매번 새로 불러옴
    refetchOnWindowFocus: false, // 윈도우 포커스시 자동 새로고침 방지
  });
};

// 영화를 검색하는 훅
export const useSearchMovies = (query: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["searchMovies", query],
    queryFn: () => searchMovies(query),
    enabled: enabled && !!query.trim(), // 검색 버튼 클릭 시에만 실행
    staleTime: 0, // 캐시가 있어도 페이지 접근시 매번 새로 불러옴
    refetchOnWindowFocus: false, // 윈도우 포커스시 자동 새로고침 방지
  });
};

// 영화 상세 정보를 가져오는 훅
export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => getMovieDetails(movieId),
    staleTime: 60 * 60 * 1000, // 1시간 동안 캐시 유지 (ISR 페이지에서 사용할 것)
    refetchOnWindowFocus: false, // 윈도우 포커스시 자동 새로고침 방지
    enabled: !!movieId,
  });
};

// 로컬에서 영화 ID로 영화 객체를 찾는 유틸리티 함수
export const findMovieById = (
  movies: Movie[],
  movieId: number
): Movie | undefined => {
  return movies.find((movie) => movie.id === movieId);
};
