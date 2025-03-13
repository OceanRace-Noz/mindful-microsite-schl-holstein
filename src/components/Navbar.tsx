
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4",
        isScrolled ? 'glass shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-opacity duration-300 hover:opacity-80"
        >
          <Leaf className="h-6 w-6 text-nature-600" />
          <span className="font-serif font-bold text-xl text-nature-800">SH Nachhaltig</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" active={location.pathname === "/"}>
            Startseite
          </NavLink>
          <NavLink to="/about" active={location.pathname === "/about"}>
            Über uns
          </NavLink>
          <NavLink to="/topics" active={location.pathname === "/topics"}>
            Themen
          </NavLink>
          <NavLink to="/contact" active={location.pathname === "/contact"}>
            Kontakt
          </NavLink>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 hover:text-nature-600 transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden absolute top-full left-0 right-0 glass shadow-md overflow-hidden transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "max-h-screen py-4" : "max-h-0"
        )}
      >
        <nav className="flex flex-col space-y-4 px-6">
          <MobileNavLink to="/" active={location.pathname === "/"}>
            Startseite
          </MobileNavLink>
          <MobileNavLink to="/about" active={location.pathname === "/about"}>
            Über uns
          </MobileNavLink>
          <MobileNavLink to="/topics" active={location.pathname === "/topics"}>
            Themen
          </MobileNavLink>
          <MobileNavLink to="/contact" active={location.pathname === "/contact"}>
            Kontakt
          </MobileNavLink>
        </nav>
      </div>
    </header>
  );
};

// NavLink component for desktop
const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      "text-sm font-medium transition-all duration-200 relative group",
      active ? "text-nature-700" : "text-gray-700 hover:text-nature-600"
    )}
  >
    {children}
    <span 
      className={cn(
        "absolute bottom-0 left-0 w-full h-0.5 transform transition-all duration-300", 
        active ? "bg-nature-500 scale-x-100" : "bg-nature-400 scale-x-0 group-hover:scale-x-100"
      )} 
    />
  </Link>
);

// NavLink component for mobile
const MobileNavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      "py-2 text-base font-medium transition-colors duration-200 block",
      active ? "text-nature-600" : "text-gray-700 hover:text-nature-500"
    )}
  >
    {children}
  </Link>
);

export default Navbar;
