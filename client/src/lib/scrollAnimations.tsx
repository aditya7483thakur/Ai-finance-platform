import { MdFace } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";
import { FaCircleDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
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

const popUpVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 25, duration: 0.8 },
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

const Features = () => {
  const navigate = useNavigate();

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
          <motion.div
            className="flex flex-col lg:flex-row justify-center items-center w-2/3 space-y-16 lg:space-y-0 lg:space-x-16 mx-auto"
            variants={containerVariants}
          >
            {mapper.map((element) => (
              <motion.div
                className="rounded-xl w-4/5 lg:w-1/5 p-4 min-h-64"
                style={{
                  boxShadow: "rgba(69, 74, 222, 0.4) 0px 12px 36px 0px",
                }}
                key={element.title}
                variants={itemVariants}
              >
                {element.icon}
                <div className="font-bold my-3 text-2xl w-2/3">
                  {element.title}
                </div>
                <div>{element.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="text-center mt-56">
          {/* Pop-Up Animated Text */}
          <motion.div
            className="text-5xl w-11/12 lg:w-7/12 mx-auto"
            style={{
              background:
                "linear-gradient(to right, #454ADE, black, #454ADE, black)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
            variants={popUpVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          >
            Take your career and wellbeing to the{" "}
            <span className="font-bold">next level</span> now
          </motion.div>

          {/* Button */}
          <div className="mt-8">
            <motion.button
              className="bg-main-300 text-white rounded-3xl font-bold px-6 py-3"
              style={{
                boxShadow: "rgba(69, 74, 222, 0.6) 0px 15px 36px 0px",
              }}
              onClick={() => navigate("/register")}
              variants={popUpVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              Sign up for free
            </motion.button>
          </div>

          {/* Background effect */}
          <div className="w-full h-72 relative overflow-hidden">
            <div
              className="w-1/2 h-1/2 rounded-full absolute left-1/2 blur-3xl bottom-[-20%] transform -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(69, 74, 222, 1))",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
