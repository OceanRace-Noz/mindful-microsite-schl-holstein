
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Article, fetchRssFeed, formatDate } from '@/utils/rssUtils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const ArticlePage = () => {
  const { link } = useParams<{ link: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  
  useEffect(() => {
    const loadArticle = async () => {
      if (!link) {
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        const decodedLink = decodeURIComponent(link);
        const articles = await fetchRssFeed('https://www.shz.de/deutschland-welt/schleswig-holstein/klima/rss');
        
        // Find the article that matches the link
        const foundArticle = articles.find(a => a.link === decodedLink);
        
        if (!foundArticle) {
          toast({
            title: "Artikel nicht gefunden",
            description: "Der gewünschte Artikel konnte nicht gefunden werden.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setArticle(foundArticle);
        
        // Set related articles (excluding current article)
        const related = articles
          .filter(a => a.link !== decodedLink)
          .slice(0, 3);
        setRelatedArticles(related);
        
        // Set page title
        document.title = `${foundArticle.title} | SH Nachhaltig`;
        
        // Add a small delay to ensure content animations look smooth
        setTimeout(() => {
          setContentReady(true);
        }, 300);
      } catch (error) {
        console.error('Failed to load article:', error);
        toast({
          title: "Fehler beim Laden",
          description: "Der Artikel konnte nicht geladen werden. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
    
    // Reset content ready state when navigating to a different article
    return () => {
      setContentReady(false);
    };
  }, [link, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!article) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-6">
          <Link 
            to="/"
            className="inline-flex items-center text-gray-500 hover:text-nature-600 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Zurück zur Übersicht</span>
          </Link>
          
          {article.categories && article.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 animate-slide-down opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              {article.categories.map((category, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-sea-50 text-sea-700"
                >
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  {category}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6 animate-slide-down opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            {article.title}
          </h1>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-8 animate-slide-down opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            {article.creator && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{article.creator}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <time dateTime={article.pubDate}>{formatDate(article.pubDate)}</time>
            </div>
          </div>
          
          {article.imageUrl && (
            <div className="mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto rounded-xl shadow-md"
              />
            </div>
          )}
          
          <div 
            className={`prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-semibold prose-a:text-sea-600 hover:prose-a:text-sea-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-md transition-opacity duration-500 ${contentReady ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* If we have content, use it; otherwise use description */}
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p>{article.description}</p>
            )}
            
            <div className="mt-8 py-6 border-t border-gray-100">
              <p className="italic text-gray-500">
                Dieser Artikel wurde ursprünglich auf <a href={article.link} target="_blank" rel="noopener noreferrer" className="font-medium">SHZ.de</a> veröffentlicht. Besuchen Sie die Originalquelle für die vollständige Geschichte.
              </p>
            </div>
          </div>
        </article>
        
        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 mt-12">
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">Das könnte Sie auch interessieren</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticlePage;
