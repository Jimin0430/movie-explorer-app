/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["image.tmdb.org"], // ✅ TMDB 이미지 도메인 허용 추가
  },
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    TMDB_API_BASE_URL: process.env.TMDB_API_BASE_URL,
    TMDB_ACCOUNT_ID: process.env.TMDB_ACCOUNT_ID,
    TMDB_SESSION_ID: process.env.TMDB_SESSION_ID,
    TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
  },
};

module.exports = nextConfig;
