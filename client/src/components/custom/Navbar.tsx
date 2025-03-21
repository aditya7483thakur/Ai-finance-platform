import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Header from "./Header";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300 px-4 md:px-20 lg:px-40 ${
        isScrolled ? "bg-white/70 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      {/* Navbar for Large Screens */}
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <span className="font-bold text-2xl text-primary">💸Budgetly</span>
        <ul className="hidden lg:flex space-x-6">
          <li className="hover:text-blue-500 cursor-pointer">Home</li>
          <li className="hover:text-blue-500 cursor-pointer">Dashboard</li>
          <li className="hover:text-blue-500 cursor-pointer">Reports</li>
          <li className="hover:text-blue-500 cursor-pointer">Settings</li>
          <Header />
        </ul>
        {/* Hamburger Icon for Small Screens */}
        <button className="lg:hidden" onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar Drawer for Small Screens */}
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
          >
            <X size={24} />
          </button>
          <ul className="mt-10 space-y-6 text-lg">
            <li className="hover:text-blue-500 cursor-pointer">Home</li>
            <li className="hover:text-blue-500 cursor-pointer">Dashboard</li>
            <li className="hover:text-blue-500 cursor-pointer">Reports</li>
            <li className="hover:text-blue-500 cursor-pointer">Settings</li>
            <Header />
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
