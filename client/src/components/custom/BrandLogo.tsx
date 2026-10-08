import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Same mark as the dashboard sidebar so public pages and the app match.
const BrandLogo = ({
  to = "/",
  className,
}: {
  to?: string;
  className?: string;
}) => (
  <Link
    to={to}
    className={cn(
      "inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      className,
    )}
  >
    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
      <Sparkles className="size-4" aria-hidden />
    </span>
    <span className="text-base font-semibold tracking-tight text-foreground">
      Budgetly
    </span>
  </Link>
);

export default BrandLogo;
