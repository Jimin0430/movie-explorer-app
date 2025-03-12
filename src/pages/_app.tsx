import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import Layout from "@/components/Layout";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  // 클라이언트 사이드에서만 QueryClient 생성
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // 캐시가 있어도 페이지 접근시 매번 새로 불러옴
            gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 가비지 컬렉션 방지
          },
        },
      })
  );

  // 서버 사이드 렌더링 감지
  const [isServer, setIsServer] = useState(true);
  const [persister, setPersister] = useState<any>(null);

  useEffect(() => {
    setIsServer(false);

    // 브라우저에서만 LocalStorage 접근
    try {
      setPersister(
        createSyncStoragePersister({
          storage: window.localStorage,
          key: "movie-app-cache",
        })
      );
    } catch (error) {
      console.error("Failed to create persister:", error);
    }
  }, []);

  // 서버 사이드 렌더링이거나 persister가 준비되지 않은 경우
  if (isServer || !persister) {
    return (
      <QueryClientProvider client={queryClient}>
        {pageProps.dehydratedState && (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
        {!pageProps.dehydratedState && (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  }

  // 클라이언트 사이드 렌더링 및 persister 준비된 경우
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
