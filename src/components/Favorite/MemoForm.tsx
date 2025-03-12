import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemoFormInput } from "@/types/memo";
import styles from "@/styles/MemoForm.module.css";

interface MemoFormProps {
  onSubmit: (data: MemoFormInput) => void;
  onCancel: () => void;
  movieTitle: string;
}

// Zod 스키마 정의
const memoSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(5, "내용은 최소 5자 이상이어야 합니다."),
  watchedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식은 YYYY-MM-DD 여야 합니다.")
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: "유효한 날짜를 입력해주세요.",
      }
    ),
});

const MemoForm: React.FC<MemoFormProps> = ({
  onSubmit,
  onCancel,
  movieTitle,
}) => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 형식

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemoFormInput>({
    resolver: zodResolver(memoSchema),
    defaultValues: {
      title: `${movieTitle} 감상 메모`,
      content: "",
      watchedAt: today,
    },
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>메모 작성</h2>
        <p className={styles.subtitle}>
          영화 <span className={styles.movieTitle}>{movieTitle}</span>에 대한
          메모를 남겨주세요.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              제목 *
            </label>
            <input id="title" {...register("title")} className={styles.input} />
            {errors.title && (
              <p className={styles.error}>{errors.title.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>
              내용 * (최소 5자)
            </label>
            <textarea
              id="content"
              {...register("content")}
              className={styles.textarea}
            ></textarea>
            {errors.content && (
              <p className={styles.error}>{errors.content.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="watchedAt" className={styles.label}>
              시청일 * (YYYY-MM-DD)
            </label>
            <input
              id="watchedAt"
              // type="date"
              {...register("watchedAt")}
              className={styles.input}
            />
            {errors.watchedAt && (
              <p className={styles.error}>{errors.watchedAt.message}</p>
            )}
          </div>

          <div className={styles.buttonsContainer}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "저장 중..." : "메모 저장 및 즐겨찾기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoForm;
