import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import MovieList from "@/components/MovieList";
import SearchBar from "@/components/SearchBar";
import { usePopularMovies, useSearchMovies } from "@/hooks/useMovies";
import { useFavoriteMovies, useFavoriteToggle } from "@/hooks/useFavorites";
import MemoForm from "@/components/Favorite/MemoForm";
import { Movie } from "@/types/movie";
import styles from "@/styles/index.module.css";

const Home: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // TanStack Query로 데이터 가져오기
  const {
    data: popularMoviesData,
    isLoading: isLoadingPopular,
    error: popularError,
  } = usePopularMovies();

  const {
    data: searchMoviesData,
    isLoading: isLoadingSearch,
    error: searchError,
  } = useSearchMovies(searchQuery, isSearching);

  const { data: favoritesData, isLoading: isLoadingFavorites } =
    useFavoriteMovies();

  // 즐겨찾기 관련 훅
  const {
    isModalOpen,
    currentMovieId,
    saveMemoAndAddFavorite,
    removeFavorite,
    openFavoriteModal,
    closeFavoriteModal,
    checkIsFavorite,
    getMemo,
  } = useFavoriteToggle();

  // 검색 처리
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
  };

  // 화면에 표시할 영화 목록 결정
  const movies: Movie[] =
    isSearching && searchMoviesData
      ? searchMoviesData.results
      : popularMoviesData
      ? popularMoviesData.results
      : [];

  // 현재 영화 제목 가져오기 (모달용)
  const getCurrentMovieTitle = (): string => {
    if (!currentMovieId) return "";

    const currentMovie = movies.find((movie) => movie.id === currentMovieId);
    return currentMovie ? currentMovie.title : "";
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>
          {isSearching ? `검색 결과: ${searchQuery}` : "인기 영화 목록"} - 영화
          앱
        </title>
      </Head>

      <h1 className={styles.title}>
        {isSearching ? `"${searchQuery}" 검색 결과` : "인기 영화 목록"}
      </h1>

      <p className={styles.subtitle}>
        {isSearching
          ? `${searchMoviesData?.total_results || 0}개의 영화를 찾았습니다.`
          : "현재 인기 있는 영화 목록입니다."}
      </p>

      <SearchBar onSearch={handleSearch} />

      <MovieList
        movies={movies}
        isLoading={isSearching ? isLoadingSearch : isLoadingPopular}
        error={isSearching ? (searchError as Error) : (popularError as Error)}
        checkIsFavorite={checkIsFavorite}
        getMemo={getMemo}
        onFavoriteClick={openFavoriteModal}
        onRemoveFavorite={removeFavorite}
      />

      {/* 메모 입력 모달 */}
      {isModalOpen && currentMovieId && (
        <MemoForm
          onSubmit={(data) => saveMemoAndAddFavorite(currentMovieId, data)}
          onCancel={closeFavoriteModal}
          movieTitle={getCurrentMovieTitle()}
        />
      )}
    </div>
  );
};

export default Home;
