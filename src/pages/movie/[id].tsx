import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getMovieDetails } from "@/api/tmdb";
import { MovieDetail } from "@/types/movie";
import { useMovieDetails } from "@/hooks/useMovies";
import { useFavoriteToggle } from "@/hooks/useFavorites";
import FavoriteButton from "@/components/Favorite/FavoriteButton";
import MemoForm from "@/components/Favorite/MemoForm";
import styles from "@/pages/movie/[id].module.css";

interface MovieDetailPageProps {
  movieId: number;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

const MovieDetailPage: NextPage<MovieDetailPageProps> = ({ movieId }) => {
  // 영화 상세 정보 가져오기
  const { data: movie, isLoading, error } = useMovieDetails(movieId);
  console.log(movie);
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

  // 즐겨찾기 상태 및 메모 정보
  const isFavorite = movie ? checkIsFavorite(movie.id) : false;
  const memo = movie ? getMemo(movie.id) : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>영화 정보를 불러오는 중 오류가 발생했습니다.</p>
        <Link href="/" className="text-blue-500 mt-4 block">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 포스터 이미지 URL
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.png";

  // 개봉일 포맷팅
  const releaseDate = new Date(movie.release_date).toLocaleDateString();

  // 상영 시간 포맷팅 (시간, 분)
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{movie.title} - 영화 앱</title>
        <meta
          name="description"
          content={movie.overview.slice(0, 150) + "..."}
        />
      </Head>

      <Link href="/" className={styles.backLink}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.backIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        홈으로 돌아가기
      </Link>

      <div className={styles.heroSection}>
        {/* 포스터 */}
        <div className={styles.posterContainer}>
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* 영화 정보 */}
        <div className={styles.infoContainer}>
          {/* 즐겨찾기 버튼 */}
          <FavoriteButton
            movieId={movie.id}
            isFavorite={isFavorite}
            onFavoriteClick={openFavoriteModal}
            onRemoveFavorite={removeFavorite}
          />
          <h1 className={styles.title}>{movie.title}</h1>

          {movie.tagline && <p className={styles.tagline}>"{movie.tagline}"</p>}

          <div className={styles.metadata}>
            <span className={styles.metaItem}>
              <span className={styles.star}>★</span>
              {movie.vote_average.toFixed(1)}
            </span>
            <span className={styles.metaItem}>개봉일: {releaseDate}</span>
            {movie.runtime > 0 && (
              <span className={styles.metaItem}>
                상영 시간: {formatRuntime(movie.runtime)}
              </span>
            )}
          </div>

          {movie.genres.length > 0 && (
            <div className={styles.genres}>
              {movie.genres.map((genre: Genre) => (
                <span key={genre.id} className={styles.genre}>
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className={styles.overview}>{movie.overview}</p>

          {/* 메모 표시 */}
          {memo && (
            <div className={styles.memoContainer}>
              <h3 className={styles.memoTitle}>{memo.title}</h3>
              <p className={styles.memoDate}>시청일: {memo.watchedAt}</p>
              <p className={styles.memoContent}>{memo.content}</p>
            </div>
          )}
        </div>
      </div>

      {/* 제작사 정보 */}
      {movie.production_companies.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>제작사</h2>
          <div className={styles.productionCompanies}>
            {movie.production_companies.map((company: Company) => (
              <div key={company.id} className={styles.company}>
                <div className={styles.companyLogo}>
                  {company.logo_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <span>{company.name.charAt(0)}</span>
                  )}
                </div>
                <span className={styles.companyName}>{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 메모 입력 모달 */}
      {isModalOpen && currentMovieId === movie.id && (
        <MemoForm
          onSubmit={(data) => saveMemoAndAddFavorite(movie.id, data)}
          onCancel={closeFavoriteModal}
          movieTitle={movie.title}
        />
      )}
    </div>
  );
};

// getStaticPaths를 사용하여 사전 렌더링할 경로를 지정 (ISR)
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // 초기에는 페이지를 미리 생성하지 않음
    fallback: "blocking", // ISR 적용 (처음 요청 시 서버에서 렌더링 후 캐싱)
  };
};

// getStaticProps를 사용하여 데이터 프리페칭 (ISR)
export const getStaticProps: GetStaticProps<
  MovieDetailPageProps,
  Params
> = async ({ params }) => {
  const movieId = parseInt(params?.id || "0", 10);

  if (!movieId) {
    return {
      notFound: true, // 404 페이지 표시
    };
  }

  const queryClient = new QueryClient();

  try {
    // 영화 상세 정보 프리페칭
    await queryClient.prefetchQuery({
      queryKey: ["movieDetails", movieId],
      queryFn: () => getMovieDetails(movieId),
    });

    return {
      props: {
        movieId,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60 * 60, // 1시간마다 재검증 (ISR)
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);

    return {
      notFound: true, // 404 페이지 표시
    };
  }
};

export default MovieDetailPage;
