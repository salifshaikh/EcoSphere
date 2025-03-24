import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/50 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="relative text-white text-4xl md:text-4xl font-extrabold tracking-wide">
        <Link
                to="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                } transition-all duration-300`}
              >
                <div className="flex items-center">
                  {/* Leaf icon for the logo */}
                  <svg 
                    className="w-8 h-8 mr-2 text-primary dark:text-white transition-colors duration-300"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M21 4.5C17.5 4.5 4.5 7.5 4.5 19.5C4.5 19.5 9 13.5 21 13.5" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M12.5 8.5C12.5 8.5 14 12.5 18 12.5" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  
                  {/* Text logo */}
                  <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-green-500 dark:from-green-400 dark:to-teal-300 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 transform origin-left">
                    EcoSphere
                  </span>
                </div>
              </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 flex-grow justify-center">
          
          {/* Replace NavLink with <a> for external link */}
          <NavLink to="/carbon-calculate" isActive={location.pathname === "/carbon-calculate"}>
            Eco Insights
          </NavLink>
          <NavLink to="/blog" isActive={location.pathname === "/blog"}>
            Community
          </NavLink>
          <NavLink to="/news" isActive={location.pathname === "/news"}>
            News
          </NavLink>
          
        </div>

        {/* Logout and Profile Button */}
        <div className="hidden md:flex items-center space-x-4">
          {loading ? (
            <span className="text-white opacity-70">Loading...</span>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center text-white hover:text-yellow-400 transition duration-300"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <User size={20} color="black" />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" isActive={location.pathname === "/login"}>
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 text-white flex flex-col space-y-4 p-4 absolute top-16 left-0 right-0 z-40">
          {/* Replace NavLink with <a> for external link */}
          <NavLink to="/carbon-calculate" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/carbon-calculate"}>
            Eco Insights
          </NavLink>
          <NavLink to="/blog" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/blog"}>
            Community
          </NavLink>
          <NavLink to="/news" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/news"}>
            News
          </NavLink>
        
          
          {loading ? (
            <span className="text-white opacity-70">Loading...</span>
          ) : user ? (
            <div className="flex flex-col space-y-4">
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/dashboard"}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <User size={20} color="black" />
                  </div>
                  <span>Dashboard</span>
                </div>
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/login"}>
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-white hover:text-yellow-400 transition duration-300 ${
        isActive ? "border-b-2 border-yellow-400" : "border-transparent"
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;