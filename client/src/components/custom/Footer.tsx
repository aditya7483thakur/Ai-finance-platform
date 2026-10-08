import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import BrandLogo from "./BrandLogo";

const COLUMNS: { title: string; links: { label: string; href: string; internal?: boolean; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Ask Budgetly", href: "#ask" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in", internal: true },
      { label: "Create account", href: "/sign-up", internal: true },
    ],
  },
  {
    title: "Project",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/aditya7483thakur/Ai-finance-platform",
        external: true,
      },
      {
        label: "Report an issue",
        href: "https://github.com/aditya7483thakur/Ai-finance-platform/issues",
        external: true,
      },
    ],
  },
];

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/6">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              AI-powered budgeting that tells you where your money goes, before
              it's gone.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-foreground">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <Link to={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className={linkClass}
                        {...(link.external
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-white/6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Budgetly. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <a
              href="https://www.linkedin.com/in/aditya7483/"
              target="_blank"
              rel="noreferrer"
              aria-label="Budgetly creator on LinkedIn"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <FaLinkedin className="size-4" aria-hidden />
            </a>
            <a
              href="https://github.com/aditya7483thakur/Ai-finance-platform"
              target="_blank"
              rel="noreferrer"
              aria-label="Budgetly on GitHub"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <FaGithub className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
