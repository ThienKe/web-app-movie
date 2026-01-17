import { Helmet } from 'react-helmet-async';

const SchemaMarkup = ({ movie }) => {
  if (!movie) return null;

  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.name,
    "image": movie.thumb_url || movie.poster_url,
    "description": movie.content?.replace(/<[^>]*>/g, '') || "Xem phim tại Phim Cú Đêm",
    "dateCreated": movie.year,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1050"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(movieSchema)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;