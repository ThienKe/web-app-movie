import { Helmet } from 'react-helmet-async';

const MetaTags = ({ title, description, image, canonical }) => {
  const siteName = "Phim Cú Đêm";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDesc = "Xem phim online chất lượng cao, cập nhật nhanh nhất tại Phim Cú Đêm - Xem phim miễn phí, không quảng cáo.";
  const url = canonical || window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <link rel="canonical" href={url} />

      {/* Open Graph (Facebook, Zalo) */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="video.movie" />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default MetaTags;