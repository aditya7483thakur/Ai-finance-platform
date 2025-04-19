import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 w-full z-50 h-18 transition-all duration-300 px-4 md:px-20 lg:px-40 ${
        isScrolled ? "bg-white/70 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold text-2xl sm:text-2xl text-primary flex items-center"
        >
          💸Budgetly
        </Link>

        {/* Desktop Header Component (User Avatar) */}
        <div className="space-x-2 sm:space-x-4 flex items-center">
          <SignedIn>
            <Link
              to="/dashboard"
              className="bg-primary text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
            >
              Dashboard →
            </Link>
          </SignedIn>

          <SignedOut>
            <Link
              to="/sign-up"
              className="bg-primary text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
            >
              Sign Up
            </Link>
            <Link
              to="/sign-in"
              className="bg-primary text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
            >
              Sign In
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
