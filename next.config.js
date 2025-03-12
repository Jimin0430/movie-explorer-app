/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["image.tmdb.org"], // ✅ TMDB 이미지 도메인 허용 추가
  },
};

module.exports = nextConfig;
