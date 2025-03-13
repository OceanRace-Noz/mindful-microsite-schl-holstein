
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/utils/rssUtils';
import ArticleCard from './ArticleCard';
import { cn } from '@/lib/utils';

interface FeaturedArticlesProps {
  articles: Article[];
}

const FeaturedArticles = ({ articles }: FeaturedArticlesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const maxIndex = Math.min(articles.length - 1, 4); // Limit to 5 featured articles
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const featuredArticles = articles.slice(0, 5); // Get first 5 articles
  
  const goToSlide = (index: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;
    goToSlide(newIndex);
  };
  
  const goToNext = () => {
    const newIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };
  
  // Auto-advance slides
  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        goToNext();
      }, 7000);
    };
    
    startAutoplay();
    
    // Clean up on unmount
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [currentIndex]);
  
  // Pause autoplay on hover
  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };
  
  // Resume autoplay on mouse leave
  const resumeAutoplay = () => {
    if (!autoplayRef.current) {
      autoplayRef.current = setInterval(() => {
        goToNext();
      }, 7000);
    }
  };
  
  if (featuredArticles.length === 0) {
    return null;
  }
  
  return (
    <section 
      className="relative w-full overflow-hidden bg-gradient-to-b from-sea-50 to-white py-10"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      <div className="container px-4 mx-auto">
        <h2 className="font-serif text-2xl font-semibold mb-6 text-center text-gray-900">
          <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-sea-100 text-sea-700 mb-2">Aktuell</span>
          <br />Nachhaltigkeits-Highlights
        </h2>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredArticles.map((article, index) => (
                <div 
                  key={article.id} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <ArticleCard article={article} featured={true} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 flex items-center justify-center shadow-md hover:bg-white transition-all duration-200 focus:outline-none z-10 -ml-2"
            aria-label="Previous article"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-gray-700 flex items-center justify-center shadow-md hover:bg-white transition-all duration-200 focus:outline-none z-10 -mr-2"
            aria-label="Next article"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {featuredArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentIndex === index 
                    ? "bg-nature-600 w-6" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;
