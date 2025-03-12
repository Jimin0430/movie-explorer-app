import React from "react";
import styles from "@/styles/FavoriteButton.module.css";

interface FavoriteButtonProps {
  movieId: number;
  isFavorite: boolean;
  onFavoriteClick: (movieId: number) => void;
  onRemoveFavorite: (movieId: number) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  movieId,
  isFavorite,
  onFavoriteClick,
  onRemoveFavorite,
}) => {
  const handleClick = () => {
    if (isFavorite) {
      // 즐겨찾기 해제 시 경고창 표시
      const confirmed = window.confirm(
        "즐겨찾기를 해제하면 저장한 메모도 함께 삭제됩니다. 계속하시겠습니까?"
      );

      if (confirmed) {
        onRemoveFavorite(movieId);
      }
    } else {
      onFavoriteClick(movieId);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles.button} ${
        isFavorite ? styles.favorite : styles.notFavorite
      }`}
      aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        viewBox="0 0 20 20"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isFavorite ? "0" : "1.5"}
      >
        <path
          fillRule="evenodd"
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;
