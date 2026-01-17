import MetaTags from './MetaTags';
import SchemaMarkup from './SchemaMarkup';

const SEO = ({ title, description, image, movie }) => {
  // Ưu tiên tiêu đề truyền vào, nếu không có và chưa có movie thì để "Đang tải..."
  const finalTitle = title || (movie ? movie.name : "Đang tải...");
  
  if (movie) {
    const finalDesc = description || movie.content?.replace(/<[^>]*>/g, '').substring(0, 160);
    const finalImg = image || movie.thumb_url || movie.poster_url;

    return (
      <>
        <MetaTags title={finalTitle} description={finalDesc} image={finalImg} />
        <SchemaMarkup movie={movie} />
      </>
    );
  }

  // Trường hợp đang loading hoặc trang tĩnh, vẫn phải trả về MetaTags để nó cập nhật Title
  return <MetaTags title={finalTitle} description={description} image={image} />;
};

export default SEO;