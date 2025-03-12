import React from "react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";
import { Memo } from "@/types/memo";
import styles from "@/styles/MovieList.module.css";

interface MovieListProps {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
  checkIsFavorite: (movieId: number) => boolean;
  getMemo: (movieId: number) => Memo | null;
  onFavoriteClick: (movieId: number) => void;
  onRemoveFavorite: (movieId: number) => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  isLoading,
  error,
  checkIsFavorite,
  getMemo,
  onFavoriteClick,
  onRemoveFavorite,
}) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>오류가 발생했습니다: {error.message}</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className={styles.empty}>
        <p>영화 목록이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={checkIsFavorite(movie.id)}
          memo={getMemo(movie.id)}
          onFavoriteClick={onFavoriteClick}
          onRemoveFavorite={onRemoveFavorite}
        />
      ))}
    </div>
  );
};

export default MovieList;
