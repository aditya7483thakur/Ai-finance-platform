import Footer from "@/components/custom/Footer";
import Navbar from "@/components/custom/Navbar";
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => (
  <>
    <Navbar />
    <div className="flex min-h-screen bg-gradient-to-r from-white to-sky-100  items-center justify-center">
      <SignUp />
    </div>
    <Footer />
  </>
);

export default SignUpPage;
