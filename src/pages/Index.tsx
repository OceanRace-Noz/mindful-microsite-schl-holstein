
import { useState, useEffect } from 'react';
import { Article, fetchRssFeed } from '@/utils/rssUtils';
import ArticleCard from '@/components/ArticleCard';
import FeaturedArticles from '@/components/FeaturedArticles';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Leaf, Search } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  
  // Fetch RSS feed on component mount
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchRssFeed('https://www.shz.de/deutschland-welt/schleswig-holstein/klima/rss');
        setArticles(data);
        setFilteredArticles(data);
      } catch (error) {
        console.error('Failed to load articles:', error);
        toast({
          title: "Fehler beim Laden",
          description: "Die Artikel konnten nicht geladen werden. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadArticles();
  }, []);
  
  // Filter articles based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = articles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.description.toLowerCase().includes(query) ||
      (article.categories && article.categories.some(cat => cat.toLowerCase().includes(query)))
    );
    
    setFilteredArticles(filtered);
  }, [searchQuery, articles]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full pt-28 pb-16 bg-gradient-to-b from-nature-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-slide-down">
              Nachhaltigkeit in Schleswig-Holstein
            </h1>
            <p className="text-xl text-gray-700 mb-8 animate-slide-up">
              Aktuelle Nachrichten und Berichte zu Nachhaltigkeit, Klimaschutz und Umweltthemen aus dem nördlichsten Bundesland.
            </p>
            
            <div className="relative max-w-xl mx-auto mb-4 animate-fade-in">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nach Artikeln suchen..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40">
          <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-sea-200 blur-3xl"></div>
          <div className="absolute -right-20 top-40 w-96 h-96 rounded-full bg-nature-200 blur-3xl"></div>
        </div>
      </section>
      
      {/* Featured Articles Carousel */}
      {articles.length > 0 && (
        <FeaturedArticles articles={articles} />
      )}
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-nature-200 border-t-nature-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Artikel werden geladen...</p>
          </div>
        ) : (
          <>
            {filteredArticles.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl font-semibold text-gray-900">
                    {searchQuery ? 'Suchergebnisse' : 'Aktuelle Artikel'}
                  </h2>
                  {searchQuery && (
                    <p className="text-gray-500">
                      {filteredArticles.length} {filteredArticles.length === 1 ? 'Ergebnis' : 'Ergebnisse'} für "{searchQuery}"
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Leaf className="mx-auto h-12 w-12 text-nature-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Keine Artikel gefunden</h3>
                <p className="text-gray-600">
                  {searchQuery ? 
                    `Keine Ergebnisse für "${searchQuery}". Bitte versuchen Sie einen anderen Suchbegriff.` : 
                    'Derzeit sind keine Artikel verfügbar. Bitte versuchen Sie es später erneut.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 inline-flex items-center text-nature-600 hover:text-nature-700"
                  >
                    Suche zurücksetzen
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
