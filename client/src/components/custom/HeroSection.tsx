import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b text-center py-12 px-4 md:px-20 lg:px-40">
        {/* Animated Tagline */}
        <motion.div
          className="mb-4"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm">
            The Smarter Way to Manage Money!
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          className="text-lg text-primary font-medium mb-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          Budgetly
        </motion.h2>

        {/* Main Heading */}
        <motion.h1
          className="text-4xl md:text-[2.5rem] font-extrabold mb-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          viewport={{ once: true }}
        >
          Turn Your <span className="text-blue-500"> Finances</span>
          <br />
          from <span className="text-blue-500"> Chaos </span> to{" "}
          <span className="text-blue-500"> Control</span>!
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-600 mb-6 max-w-2xl mx-auto "
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          viewport={{ once: true }}
        >
          Track expenses, set budgets, and gain financial clarity—instantly.
          <br />
          Because managing money shouldn’t be complicated.
        </motion.p>

        {/* CTA Section */}
        <motion.div
          className="flex justify-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/sign-up"
              className="bg-primary text-white px-6 py-2 rounded-md shadow hover:bg-primary/90 transition-all duration-200 block"
            >
              Get Started →
            </Link>
          </motion.div>

          <motion.a
            href="https://github.com/aditya7483thakur/Ai-finance-platform"
            target="_blank"
            className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Learn More
          </motion.a>
        </motion.div>
      </section>

      {/* Hero Image */}
      <motion.div
        className="p-9 flex justify-center items-center"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.img
          src="/transactions.png"
          alt="Screenshot of Budgetly dashboard"
          className="w-full max-w-4xl rounded-xl shadow-lg transition-transform hover:scale-105 duration-300"
          loading="lazy"
        />
      </motion.div>
    </>
  );
};

export default HeroSection;
