import { Helmet } from 'react-helmet-async';

const PageMeta = ({ title, description, image, canonical }) => {
  const siteName = "Phim Cú Đêm";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "Xem phim online chất lượng cao, cập nhật nhanh nhất tại Phim Cú Đêm.";
  const url = canonical || window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      {/* Facebook & Zalo (Open Graph) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:url" content={url} />
      {/* Canonical Link - Tránh trùng lặp nội dung cho SEO */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default PageMeta;