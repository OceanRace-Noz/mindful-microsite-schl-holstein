
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Article, formatDate, createExcerpt } from '@/utils/rssUtils';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fallbackImage, setFallbackImage] = useState(false);
  
  // Default image if article doesn't have one
  const defaultImage = fallbackImage 
    ? `/placeholder.svg` 
    : `https://source.unsplash.com/featured/800x600/?nature,sustainability`;
  
  const imageUrl = article.imageUrl || defaultImage;
  
  useEffect(() => {
    // Check if article has an image, if not set fallback after a delay
    if (!article.imageUrl) {
      const timer = setTimeout(() => setFallbackImage(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [article.imageUrl]);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    setFallbackImage(true);
  };
  
  return (
    <article 
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg transition-all duration-300 bg-white hover:shadow-md border border-gray-100",
        featured ? "md:flex-row" : "h-full"
      )}
    >
      <Link 
        to={`/article/${encodeURIComponent(article.link)}`}
        className={cn(
          "block overflow-hidden",
          featured ? "md:w-1/2" : "aspect-video w-full"
        )}
      >
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt={article.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              imageLoaded ? "blur-none" : "blur-sm",
              "group-hover:scale-105 transition-transform duration-700"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      <div className={cn(
        "flex flex-col p-5 space-y-2",
        featured ? "md:w-1/2" : ""
      )}>
        {article.categories && article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {article.categories.slice(0, 3).map((category, index) => (
              <span 
                key={index} 
                className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-sea-50 text-sea-700"
              >
                {category}
              </span>
            ))}
          </div>
        )}
        
        <Link to={`/article/${encodeURIComponent(article.link)}`}>
          <h3 className={cn(
            "font-serif font-semibold text-gray-900 group-hover:text-nature-600 transition-colors duration-200 line-clamp-2",
            featured ? "text-2xl" : "text-lg"
          )}>
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 line-clamp-3 text-sm">
          {createExcerpt(article.description, featured ? 180 : 120)}
        </p>
        
        <div className="mt-auto pt-3 flex items-center justify-between text-sm text-gray-500">
          <span>{article.creator || 'SH Nachhaltig'}</span>
          <time dateTime={article.pubDate}>{formatDate(article.pubDate)}</time>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
