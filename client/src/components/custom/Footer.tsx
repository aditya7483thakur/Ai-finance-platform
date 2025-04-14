import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary py-12 px-4 md:px-20 lg:px-40"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-full flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white "> 💸Budgetly</h1>
            </div>

            <div className="flex space-x-4">
              <motion.a
                href="https://www.linkedin.com/in/aditya7483/"
                className="text-white hover:text-gray-700"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://github.com/aditya7483thakur/Ai-finance-platform"
                className="text-white hover:text-gray-700 "
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 text-white  mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white  text-sm"
          >
            &copy; {currentYear} Budgetly. All rights reserved.
          </motion.p>
          <motion.p
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white  text-sm mt-4 md:mt-0"
          >
            Built with ❤️ to simplify your finances
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
}
