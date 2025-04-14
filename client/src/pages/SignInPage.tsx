import Footer from "@/components/custom/Footer";
import Navbar from "@/components/custom/Navbar";
import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <>
    <Navbar />
    <div className="flex min-h-screen items-center bg-gradient-to-r from-white to-sky-100  justify-center">
      <SignIn />
    </div>
    <Footer />
  </>
);

export default SignInPage;
