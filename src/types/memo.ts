// 메모 인터페이스
export interface Memo {
  id: string;
  movieId: number;
  title: string;
  content: string;
  watchedAt: string; // yyyy-mm-dd 형식의 문자열
  createdAt: string; // ISO 문자열
}

// 메모 폼 입력값 인터페이스
export interface MemoFormInput {
  title: string;
  content: string;
  watchedAt: string;
}
