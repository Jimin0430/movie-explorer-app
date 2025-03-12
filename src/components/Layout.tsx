import React, { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/Layout.module.css";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "영화 앱" }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="TMDB API를 활용한 영화 검색 및 즐겨찾기 앱"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <nav className={styles.nav}>
            <Link href="/" className={styles.logo}>
              영화 앱
            </Link>
            <div className={styles.navLinks}>
              <Link href="/" className={styles.navLink}>
                홈
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p>
            © {new Date().getFullYear()} 영화 앱. TMDB API를 사용하여
            제작되었습니다.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
