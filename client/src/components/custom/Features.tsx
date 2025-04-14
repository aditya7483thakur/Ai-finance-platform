import { motion } from "framer-motion";
import {
  BarChart,
  Wallet,
  Banknote,
  LineChart,
  Lock,
  RefreshCcw,
} from "lucide-react";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
};

const Features = () => {
  const features = [
    {
      id: 1,
      title: "Smart Budgeting",
      icon: <BarChart className="w-8 h-8 text-blue-500" />,
      description:
        "Set spending limits, track expenses, and get alerts when you're close to exceeding your budget.",
    },
    {
      id: 2,
      title: "Seamless Transactions",
      icon: <Wallet className="w-8 h-8 text-blue-500" />,
      description:
        "Easily add, categorize, and manage transactions with instant organization.",
    },
    {
      id: 3,
      title: "Multiple Accounts Management",
      icon: <Banknote className="w-8 h-8 text-blue-500" />,
      description:
        "Link multiple accounts, track balances, and view all your finances in one place.",
    },
    {
      id: 4,
      title: "Insightful Reports",
      icon: <LineChart className="w-8 h-8 text-blue-500" />,
      description:
        "Generate spending reports by category, account, or status to make informed decisions.",
    },
    {
      id: 5,
      title: "Secure & Fast Authentication",
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      description:
        "Enjoy a seamless login experience with secure authentication.",
    },
    {
      id: 6,
      title: "Automated Expense Tracking",
      icon: <RefreshCcw className="w-8 h-8 text-blue-500" />,
      description:
        "Set up recurring transactions and automate bill payments effortlessly.",
    },
  ];

  return (
    <section className="bg-gradient-to-b py-16 px-4 md:px-20 lg:px-40">
      <div>
        {" "}
        <motion.div
          className="mx-auto text-center mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.8 }}
          variants={containerVariants} // for staggerChildren
        >
          {/* Animated Heading */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={textVariants} // this will now work because parent has initial/show
          >
            Unlock the Power of AI for{" "}
            <span className="text-blue-500">Smarter Finance</span>
          </motion.h2>

          {/* Animated Paragraph */}
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            variants={textVariants} // will animate with stagger
          >
            Say goodbye to manual bookkeeping—let smart automation handle your
            transactions while you focus on growth.
          </motion.p>
        </motion.div>
      </div>
      {/* Motion Container */}
      <motion.div
        className="flex flex-wrap justify-center gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            className="flex flex-col items-center text-center bg-white rounded-2xl shadow-md border border-gray-100 p-6 w-full sm:w-[48%] md:w-[30%] hover:shadow-xl "
            variants={cardVariants}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
