
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { checkIsAdmin } from "@/utils/supabaseHelpers";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const adminStatus = await checkIsAdmin(user.id);
        setIsAdmin(adminStatus);
      }
    };

    verifyAdmin();
  }, [user]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto py-4 px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-findora-navy">
            Findora
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-findora-navy focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-findora-navy transition-colors"
            >
              Home
            </Link>
            <Link
              to="/search"
              className="text-gray-600 hover:text-findora-navy transition-colors"
            >
              Search
            </Link>
            <Link
              to="/stories"
              className="text-gray-600 hover:text-findora-navy transition-colors"
            >
              Stories
            </Link>
            <Link
              to="/affiliate"
              className="text-gray-600 hover:text-findora-navy transition-colors"
            >
              Affiliate
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-600 hover:text-findora-navy transition-colors"
              >
                Admin
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/upload"
                  className="text-gray-600 hover:text-findora-navy transition-colors"
                >
                  Upload
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-findora-navy transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-600 hover:text-findora-navy transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-findora-navy transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-600 hover:text-findora-navy transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-findora-navy transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="text-gray-600 hover:text-findora-navy transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/stories"
                className="text-gray-600 hover:text-findora-navy transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Link
                to="/affiliate"
                className="text-gray-600 hover:text-findora-navy transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Affiliate
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-findora-navy transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="text-gray-600 hover:text-findora-navy transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Upload
                  </Link>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-findora-navy transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-findora-navy transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-findora-navy transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-gray-600 hover:text-findora-navy transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
