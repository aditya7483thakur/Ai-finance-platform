import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { PiSquaresFourBold } from "react-icons/pi";
import { MdOutlineMail } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import Header from "./Header";

// Define the interface for the Sidebar props
interface SidebarProps {
  toggleOpen: () => void;
}

// Define the base link style
const baseLinkStyle =
  "flex items-center text-base md:text-md text-main-900 font-normal justify-start gap-2 hover:bg-brandprimary hover:bg-opacity-10 px-3 py-3";

// Sidebar Component
const Sidebar = ({ toggleOpen }: SidebarProps) => {
  // Static data for demonstration
  const interviewData = {
    available: 5, // Example: 5 credits available
  };

  const profileData = {
    data: {
      student: {
        firstname: "John",
        lastname: "Doe",
      },
    },
  };
  return (
    <div className="relative bg-white lg:w-64 flex flex-col border-r-2 border-brightred border-opacity-15 h-screen pt-4 lg:mt-3">
      {/* Logo Section */}
      <NavLink to="/" className="mx-4 pl-4 inline-flex">
        <span className="font-normal uppercase font-inter text-3xl text-black">
          Iam
          <span className="font-extrabold text-main-300">Ready</span>
          <span className="font-extrabold italic">AI.</span>
        </span>
      </NavLink>

      {/* Main Navigation Links */}
      <NavLink
        to="/dashboard/overview"
        className="bg-main-300 capitalize flex justify-start items-center text-white text-base h-12 md:text-md rounded-xl font-bold tracking-wide px-4 mt-8 mx-4 min-w-56"
        onClick={toggleOpen}
      >
        <PiSquaresFourBold className="inline-block rounded-full text-brandprimary w-5 h-5 mr-2 rotate-45" />
        Overview
      </NavLink>

      <Button
        className="bg-white text-main-900 capitalize justify-start hover:bg-slate-800 hover:text-white text-base h-12 md:text-md rounded-xl font-normal tracking-wide px-4 mt-3 mx-4 min-w-56"
        onClick={toggleOpen}
      >
        <MdOutlineMail className="inline-block rounded-full text-brandprimary w-5 h-5 mr-2" />
        Inbox
      </Button>

      {/* Credits Section */}
      <div className="px-4 mt-4">
        <div className="mb-10">
          <h3 className="font-bold text-sm mb-2">
            {profileData.data.student.firstname} $
            {profileData.data.student.lastname}
          </h3>
          <h3 className="font-bold text-sm mb-1">
            {interviewData.available} credits
          </h3>
          <h4 className="text-sm mb-2 mt-1">
            That’s good for {interviewData.available} more mock interviews!
          </h4>
          <h4 className="text-sm">
            You can buy more{" "}
            <Link to="/dashboard/pricing" className="underline">
              here
            </Link>
          </h4>
        </div>
      </div>

      {/* Bottom Navigation Links */}
      <div className="absolute w-full bottom-6 left-0 px-4">
        <NavLink to="/dashboard/settings">
          <button className={cn(baseLinkStyle, "w-full hover:bg-gray-950")}>
            <CgProfile className="w-5 h-5" />
            Profile
          </button>
        </NavLink>
        <NavLink to="/dashboard/help">
          <button className={cn(baseLinkStyle, "w-full hover:bg-gray-950")}>
            <AiOutlineQuestionCircle className="w-5 h-5" />
            Help
          </button>
        </NavLink>
        <Header />
      </div>
    </div>
  );
};

export default Sidebar;
