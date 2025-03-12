import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";
import { Memo } from "@/types/memo";
import FavoriteButton from "@/components/Favorite/FavoriteButton";
import styles from "@/styles/MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  memo: Memo | null;
  onFavoriteClick: (movieId: number) => void;
  onRemoveFavorite: (movieId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  memo,
  onFavoriteClick,
  onRemoveFavorite,
}) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.png";

  return (
    <div className={styles.card}>
      <Link href={`/movie/${movie.id}`}>
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{movie.title}</h3>
          <p className={styles.releaseDate}>
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <div className={styles.ratingContainer}>
            <span className={styles.star}>★</span>
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </Link>

      {/* 즐겨찾기 버튼 */}
      <FavoriteButton
        movieId={movie.id}
        isFavorite={isFavorite}
        onFavoriteClick={onFavoriteClick}
        onRemoveFavorite={onRemoveFavorite}
      />
      {/* 메모 표시 */}
      {memo && (
        <div className={styles.memoContainer}>
          <div className={styles.memo}>
            <h4 className={styles.memoTitle}>{memo.title}</h4>
            <p className={styles.memoDate}>시청일: {memo.watchedAt}</p>
            <p className={styles.memoContent}>{memo.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
