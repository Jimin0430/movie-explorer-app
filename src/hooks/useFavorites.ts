import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toggleFavorite, getFavoriteMovies } from "@/api/tmdb";
import { Memo, MemoFormInput } from "@/types/memo";
import {
  saveMemo,
  getMovieMemo,
  saveFavoriteStatus,
  isMovieFavorite,
} from "@/utils/localStorage";
import { v4 as uuidv4 } from "uuid";
import { deleteMemo } from "@/utils/localStorage";

// 즐겨찾기 목록을 가져오는 훅
export const useFavoriteMovies = () => {
  return useQuery({
    queryKey: ["favoriteMovies"],
    queryFn: getFavoriteMovies,
    staleTime: 0, // 캐시가 있어도 페이지 접근시 매번 새로 불러옴
    refetchOnWindowFocus: false, // 윈도우 포커스시 자동 새로고침 방지
  });
};

// 즐겨찾기 토글 훅
export const useFavoriteToggle = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState<number | null>(null);

  // 즐겨찾기 토글 뮤테이션
  const toggleFavoriteMutation = useMutation({
    mutationFn: ({
      movieId,
      isFavorite,
    }: {
      movieId: number;
      isFavorite: boolean;
    }) => toggleFavorite(movieId, isFavorite),
    onSuccess: (_, variables) => {
      // 로컬 스토리지에 즐겨찾기 상태 저장
      saveFavoriteStatus(variables.movieId, variables.isFavorite);

      // 즐겨찾기 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["favoriteMovies"] });
    },
  });

  // 메모 저장 및 즐겨찾기 추가 함수
  const saveMemoAndAddFavorite = (movieId: number, memoData: MemoFormInput) => {
    // 현재 시간을 ISO 문자열로 변환
    const now = new Date().toISOString();

    // 새 메모 객체 생성
    const newMemo: Memo = {
      id: uuidv4(),
      movieId,
      title: memoData.title,
      content: memoData.content,
      watchedAt: memoData.watchedAt,
      createdAt: now,
    };

    // 메모를 로컬 스토리지에 저장
    saveMemo(newMemo);

    // 즐겨찾기 API 호출
    toggleFavoriteMutation.mutate({ movieId, isFavorite: true });

    // 모달 닫기
    setIsModalOpen(false);
    setCurrentMovieId(null);
  };

  // 즐겨찾기에서 제거
  const removeFavorite = (movieId: number) => {
    toggleFavoriteMutation.mutate({ movieId, isFavorite: false });
    //메모 함께 제거
    deleteMemo(movieId);
  };

  // 즐겨찾기 추가 모달 열기
  const openFavoriteModal = (movieId: number) => {
    setCurrentMovieId(movieId);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeFavoriteModal = () => {
    setIsModalOpen(false);
    setCurrentMovieId(null);
  };

  // 특정 영화가 즐겨찾기인지 확인 (로컬 스토리지 사용)
  const checkIsFavorite = (movieId: number): boolean => {
    return isMovieFavorite(movieId);
  };

  // 특정 영화의 메모 가져오기
  const getMemo = (movieId: number): Memo | null => {
    return getMovieMemo(movieId);
  };

  return {
    isModalOpen,
    currentMovieId,
    isLoading: toggleFavoriteMutation.isPending,
    isError: toggleFavoriteMutation.isError,
    error: toggleFavoriteMutation.error,
    saveMemoAndAddFavorite,
    removeFavorite,
    openFavoriteModal,
    closeFavoriteModal,
    checkIsFavorite,
    getMemo,
  };
};
