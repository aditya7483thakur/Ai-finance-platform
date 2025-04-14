import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Header from "./Header";

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
        <a
          href="/"
          className="font-extrabold text-2xl text-primary flex items-center"
        >
          💸Budgetly
        </a>

        {/* Nav Links (Desktop) */}
        <ul className="hidden lg:flex items-center space-x-8 text-base font-medium mr-20">
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Reports
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary transition-colors">
              Settings
            </a>
          </li>
        </ul>

        {/* Header Component (User Avatar) */}
        <div className="hidden lg:block">
          <Header />
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
              <a href="#" className="hover:text-primary block">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary block">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary block">
                Reports
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary block">
                Settings
              </a>
            </li>
            <li>
              <Header />
            </li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
