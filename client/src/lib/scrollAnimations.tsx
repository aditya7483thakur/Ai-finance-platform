import { MdFace } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";
import { FaCircleDot } from "react-icons/fa6";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger effect for child elements
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
};

const textPopUp = {
  hidden: { opacity: 0, scale: 0.7 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HomeSectionThree = () => {
  const mapper = [
    {
      title: "Interview Prep",
      desc: "Ace your interviews with AI-powered practice sessions.",
      icon: <MdFace className="w-14 h-14" />,
    },

    {
      title: "Jobs",
      desc: "Discover tailored job opportunities that match your skills and career goals.",
      icon: <BiSolidPencil className="w-14 h-14" />,
    },
    {
      title: "Wellness",
      desc: "Prioritize your well-being with 24/7 access to mental health resources and support.",
      icon: <FaCircleDot className="w-14 h-14" />,
    },
  ];

  return (
    <>
      <div className="mt-36">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          {/* Animated Gradient Text */}
          <motion.div
            className="text-4xl lg:ml-32 text-center lg:text-start"
            style={{
              background:
                "linear-gradient(to right, #454ADE, black, #454ADE, black)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
            variants={textPopUp}
          >
            From <span className="font-bold">Wealth</span> to
            <span className="font-bold"> Wellness</span>
          </motion.div>

          {/* Animated Subheading */}
          <motion.div
            className="lg:ml-32 mb-16 text-xl mt-4 lg:mt-0 text-center lg:text-start"
            variants={textVariants}
          >
            We’ve got you covered
          </motion.div>

          {/* Motion container with stagger effect for cards */}
        </motion.div>
      </div>
    </>
  );
};

export default HomeSectionThree;
