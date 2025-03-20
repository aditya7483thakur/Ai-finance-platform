import { motion } from "framer-motion";
import adityaImage from "@/assets/aditya.jpg";
import saifImage from "@/assets/saif.jpg";
import sanikaImage from "@/assets/sanika.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const cardPopUp = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  show: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.2,
      ease: "easeOut",
      type: "spring",
      stiffness: 120,
    },
  }),
};

const testimonials = [
  {
    name: "Aditya Kumar",
    feedback: ` "iamreadyAI  for internship interviews with its mock interviews and AI-driven feedback. It improved my communication and problem-solving skills, making me feel more confident during the interviews."`,
    img: adityaImage,
    proffession: "Student",
    company: "MSIT",
  },

  {
    name: "Md. Saif Ali",
    feedback: ` "Through hands-on training and detailed feedback, I improved my problem-solving and communication skills. Mock interviews gave me the confidence to navigate the job search process more effectively."`,
    img: saifImage,
    proffession: "Student",
    company: "BCET",
  },

  {
    name: "Sanika Patil",
    feedback: ` "This platform was easy to use and made my placement preparation much smoother. The structured practice and feedback helped me improve my skills and feel more confident for my interviews."`,
    img: sanikaImage,
    proffession: "Student",
    company: "PICT",
  },

  {
    name: "Sanika Patil",
    feedback: ` "This platform was easy to use and made my placement preparation much smoother. The structured practice and feedback helped me improve my skills and feel more confident for my interviews."`,
    img: sanikaImage,
    proffession: "Student",
    company: "PICT",
  },
];

const HomeSectionTwo = () => {
  return (
    <>
      <div className=" px-4 md:px-20 lg:px-40">
        <section className="py-16 px-4">
          <div className="mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              What Our
              <span className="text-blue-500">Users</span> Say
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Hear from our satisfied users about how our platform has made
              managing finances easier and more efficient.
            </p>
          </div>
        </section>
        <motion.div
          className=" flex flex-wrap justify-center gap-6 px-6 lg:px-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={cardPopUp}
        >
          <Carousel
            opts={{
              align: "start",
            }}
            className="mx-auto w-full max-w-7xl mt-3"
          >
            <CarouselContent>
              {testimonials.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div
                    className="flex justify-center flex-col p-4 px-6 rounded-lg bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.24)]"
                    key={index}
                  >
                    <div className="font-bold text-main-300 text-xl mt-2">
                      {item.name}
                    </div>
                    <div className="text-sm mt-4">{item.feedback}</div>
                    <div className="flex justify-between items-center mt-5">
                      <img
                        className="w-16 h-16 rounded-full"
                        src={item.img}
                        alt=""
                      />
                      <div>
                        <div className="font-bold text-end">
                          {item.proffession}
                        </div>
                        <div className="text-end">{item.company}</div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="translate-x-14 lg:translate-x-0" />
            <CarouselNext className="-translate-x-14 lg:translate-x-0" />
          </Carousel>
        </motion.div>
      </div>

      <div className="w-full bg-gradient-to-r from-white to-sky-100 text-gray-900 text-center py-16 px-6 mb-5">
        <motion.h2
          className="text-4xl font-bold mb-4 text-sky-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Take Control of Your Finances Today 💡
        </motion.h2>

        <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-700">
          Join thousands of users who simplify financial management
          effortlessly. Sign up now and experience seamless control!
        </p>

        <motion.button
          className="bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg text-lg hover:bg-sky-700 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started for Free!
        </motion.button>
      </div>
    </>
  );
};

export default HomeSectionTwo;
