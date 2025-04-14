import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Samantha Ray",
    feedback:
      "Budgetly made it super easy to track expenses. I used to hate budgeting, but now I actually enjoy it.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    profession: "Digital Marketer",
    companyOrCollege: "Freelancer",
  },
  {
    name: "James Thompson",
    feedback:
      "The personalized tips based on my spending are amazing. It genuinely feels like having a smart finance coach with me.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    profession: "Startup Founder",
    companyOrCollege: "FinGrow Tech",
  },
  {
    name: "Priya Mehta",
    feedback:
      "Thanks to Budgetly alerts, I was finally able to stay within my grocery budget without stressing about overspending again.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    profession: "Graduate Student",
    companyOrCollege: "University of Toronto",
  },
  {
    name: "Arjun Nair",
    feedback:
      "Recurring transaction tracking is so helpful. I never forget rent or subscriptions anymore—it’s all handled automatically by Budgetly.",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    profession: "Software Engineer",
    companyOrCollege: "Zoho Corp",
  },
  {
    name: "Emily Chen",
    feedback:
      "The clean and simple interface makes budgeting feel easy. I no longer get overwhelmed by tracking my expenses.",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
    profession: "UI/UX Designer",
    companyOrCollege: "Notion",
  },
  {
    name: "Rohan Verma",
    feedback:
      "As a student, Budgetly is perfect. Budget alerts and summaries keep me on track without needing constant checks.",
    img: "https://randomuser.me/api/portraits/men/27.jpg",
    profession: "Computer Science Student",
    companyOrCollege: "IIT Bombay",
  },
];

const HomeSectionTwo = () => {
  return (
    <>
      <div className="px-4 md:px-20 lg:px-40 mt-10">
        <section className="pt-16 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mx-auto"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
              What Our
              <span className="text-blue-500"> Users</span> Say
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              Hear from our satisfied users about how our platform has made
              managing finances easier and more efficient.
            </p>
          </motion.div>
        </section>
        <div className="flex flex-wrap justify-center gap-6 px-6 lg:px-20">
          <Carousel opts={{ align: "start" }} className="mx-auto w-full mt-3">
            <CarouselContent className="p-4">
              {testimonials.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    className="flex justify-center flex-col p-4 px-6 rounded-lg bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.24)]"
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                    viewport={{ once: true }}
                  >
                    <div className="font-bold text-main-300 text-xl mt-2">
                      {item.name}
                    </div>
                    <div className="text-sm mt-4 flex-grow">
                      {item.feedback}
                    </div>
                    <div className="flex justify-between items-center mt-5">
                      <img
                        className="w-16 h-16 rounded-full"
                        src={item.img}
                        alt=""
                      />
                      <div>
                        <div className="font-bold text-end">
                          {item.profession}
                        </div>
                        <div className="text-end">{item.companyOrCollege}</div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="translate-x-14 lg:translate-x-0" />
            <CarouselNext className="-translate-x-14 lg:translate-x-0" />
          </Carousel>
        </div>
      </div>

      <div className="w-full bg-gradient-to-r from-white to-sky-100 text-gray-900 text-center py-16 px-6 mb-28 mt-16 ">
        <motion.h2
          className="text-4xl font-extrabold mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          Take Control of Your <span className="text-blue-500">Finances</span>{" "}
          Today 💡
        </motion.h2>

        <motion.p
          className="text-lg max-w-2xl mx-auto mb-6 text-gray-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          Join thousands of users who simplify financial management
          effortlessly. Sign up now and experience seamless control!
        </motion.p>

        <motion.button
          className="bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-lg text-lg hover:bg-sky-700 hover:cursor-pointer transition-all"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          Get Started for Free!
        </motion.button>
      </div>
    </>
  );
};

export default HomeSectionTwo;
