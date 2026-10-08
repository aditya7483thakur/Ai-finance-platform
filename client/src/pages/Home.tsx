import { MotionConfig } from "framer-motion";
import AskBudgetlyDemo from "@/components/custom/AskBudgetlyDemo";
import CallToAction from "@/components/custom/CallToAction";
import FAQ from "@/components/custom/FAQ";
import Features from "@/components/custom/Features";
import Footer from "@/components/custom/Footer";
import HeroSection from "@/components/custom/HeroSection";
import HowItWorks from "@/components/custom/HowItWorks";
import Navbar from "@/components/custom/Navbar";
import { useDarkRoot } from "@/hooks/useDarkRoot";

const Home = () => {
  useDarkRoot();

  return (
    <MotionConfig reducedMotion="user">
      <div className="dark min-h-svh bg-background text-foreground">
        <Navbar />
        <main>
          <HeroSection />
          <Features />
          <AskBudgetlyDemo />
          <HowItWorks />
          <FAQ />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};

export default Home;
