import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa6";
import { useUserContext } from "@/contexts/userContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BrandLogo from "./BrandLogo";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#ask", label: "Ask Budgetly" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn } = useUserContext();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        isScrolled
          ? "border-white/8 bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <BrandLogo />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://github.com/aditya7483thakur/Ai-finance-platform"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaGithub className="size-4" aria-hidden />
              GitHub
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <Button size="sm" asChild>
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:bg-white/5 hover:text-foreground"
                asChild
              >
                <Link to="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
