
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Leaf, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="text-center px-6 animate-fade-in">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-nature-100 rounded-full opacity-50 animate-pulse"></div>
            <Leaf className="relative z-10 w-full h-full text-nature-600" />
          </div>
          
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Diese Seite konnten wir leider nicht finden. Sie wurde vielleicht verschoben oder gelöscht.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-nature-600 text-white rounded-lg hover:bg-nature-700 transition-colors duration-200"
          >
            <Home className="h-5 w-5" />
            <span>Zurück zur Startseite</span>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
