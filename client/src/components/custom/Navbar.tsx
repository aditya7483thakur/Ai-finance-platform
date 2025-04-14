import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold text-2xl text-primary flex items-center"
        >
          💸Budgetly
        </Link>

        {/* Desktop Header Component (User Avatar) */}
        <div className="hidden lg:flex space-x-4">
          <SignedIn>
            <Link
              to="/dashboard"
              className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
            >
              Dashboard →
            </Link>
          </SignedIn>

          <SignedOut>
            <Link
              to="/sign-up"
              className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
            >
              Sign Up
            </Link>
            <Link
              to="/sign-in"
              className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
            >
              Sign In
            </Link>
          </SignedOut>
        </div>

        {/* Hamburger (Mobile) */}
        <button
          className="lg:hidden text-gray-800"
          onClick={() => setIsOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 z-50"
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
          >
            <X size={24} />
          </button>
          <ul className="mt-12 space-y-6 text-base font-medium">
            <li>
              <Link to="/" className="hover:text-primary block">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-primary block">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/reports" className="hover:text-primary block">
                Reports
              </Link>
            </li>
            <li>
              <Link to="/settings" className="hover:text-primary block">
                Settings
              </Link>
            </li>
            <SignedIn>
              <li>
                <Link
                  to="/dashboard"
                  className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
                >
                  Dashboard →
                </Link>
              </li>
            </SignedIn>
            <SignedOut>
              <li>
                <Link
                  to="/sign-up"
                  className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/sign-in"
                  className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition duration-200"
                >
                  Sign In
                </Link>
              </li>
            </SignedOut>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
