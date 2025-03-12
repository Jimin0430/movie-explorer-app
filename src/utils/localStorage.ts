import { Memo } from "@/types/memo";

// localStorage 사용 가능 여부 확인
const isLocalStorageAvailable = () => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// 메모 목록 가져오기
export const getMemos = (): Memo[] => {
  if (!isLocalStorageAvailable()) return [];

  try {
    const memos = localStorage.getItem("movie-memos");
    return memos ? JSON.parse(memos) : [];
  } catch (error) {
    console.error("메모 목록을 가져오는 중 오류 발생:", error);
    return [];
  }
};

// 특정 영화의 메모 가져오기
export const getMovieMemo = (movieId: number): Memo | null => {
  const memos = getMemos();
  return memos.find((memo) => memo.movieId === movieId) || null;
};

// 메모 추가/수정하기
export const saveMemo = (memo: Memo): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    const memos = getMemos();
    const existingIndex = memos.findIndex((m) => m.movieId === memo.movieId);

    if (existingIndex >= 0) {
      // 기존 메모 업데이트
      memos[existingIndex] = memo;
    } else {
      // 새 메모 추가
      memos.push(memo);
    }

    localStorage.setItem("movie-memos", JSON.stringify(memos));
  } catch (error) {
    console.error("메모를 저장하는 중 오류 발생:", error);
  }
};

// 메모 삭제하기
export const deleteMemo = (movieId: number): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    const memos = getMemos();
    const filteredMemos = memos.filter((memo) => memo.movieId !== movieId);
    localStorage.setItem("movie-memos", JSON.stringify(filteredMemos));
  } catch (error) {
    console.error("메모를 삭제하는 중 오류 발생:", error);
  }
};

// 영화 즐겨찾기 상태 저장 (API 호출 외에 로컬에서도 추적)
export const saveFavoriteStatus = (
  movieId: number,
  isFavorite: boolean
): void => {
  if (!isLocalStorageAvailable()) return;

  try {
    const favorites = getFavoriteIds();

    if (isFavorite) {
      // 즐겨찾기에 추가
      if (!favorites.includes(movieId)) {
        favorites.push(movieId);
      }
    } else {
      // 즐겨찾기에서 제거
      const index = favorites.indexOf(movieId);
      if (index > -1) {
        favorites.splice(index, 1);
      }
    }

    localStorage.setItem("favorite-movie-ids", JSON.stringify(favorites));
  } catch (error) {
    console.error("즐겨찾기 상태를 저장하는 중 오류 발생:", error);
  }
};

// 즐겨찾기 영화 ID 목록 가져오기
export const getFavoriteIds = (): number[] => {
  if (!isLocalStorageAvailable()) return [];

  try {
    const favoriteIds = localStorage.getItem("favorite-movie-ids");
    return favoriteIds ? JSON.parse(favoriteIds) : [];
  } catch (error) {
    console.error("즐겨찾기 ID 목록을 가져오는 중 오류 발생:", error);
    return [];
  }
};

// 영화가 즐겨찾기에 있는지 확인 (로컬 스토리지 기준)
export const isMovieFavorite = (movieId: number): boolean => {
  const favoriteIds = getFavoriteIds();
  return favoriteIds.includes(movieId);
};
