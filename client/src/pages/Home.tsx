import Features from "@/components/custom/Features";
import Footer from "@/components/custom/Footer";
import HeroSection from "@/components/custom/HeroSection";
import Navbar from "@/components/custom/Navbar";
import PricingPlans from "@/components/custom/PricingPlans ";
import Testimonials from "@/components/custom/Testimonials";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-white to-sky-100 font-sans pt-16">
        <HeroSection />
        <Features />
        <PricingPlans />
        <Testimonials />
      </div>
      <Footer />
    </>
  );
};

export default Home;
