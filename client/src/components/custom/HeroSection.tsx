import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  Check,
  ChevronRight,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/userContext";
import ProductPreview from "./ProductPreview";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const REASSURANCES = ["Free forever", "No bank login needed", "Set up in a minute"];

const HeroSection = () => {
  const { isSignedIn } = useUserContext();
  const reduceMotion = useReducedMotion();
  const previewRef = useRef<HTMLDivElement>(null);

  // The preview starts tilted back and flattens as it scrolls into view.
  const { scrollYProgress } = useScroll({
    target: previewRef,
    offset: ["start end", "start 25%"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : 22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 1 : 0.94, 1]);

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      {/* Glow + grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[900px]"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgb(38 121 243 / 26%) 0%, rgb(99 102 241 / 10%) 45%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(65%_50%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 5%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <motion.div
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08 }}
      >
        <motion.a
          variants={fadeUp}
          href="#ask"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pr-3 pl-1 text-xs text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-medium text-accent">
            <Sparkles className="size-3" aria-hidden />
            AI
          </span>
          Meet Ask Budgetly, your money assistant
          <ChevronRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </motion.a>

        <motion.h1
          variants={fadeUp}
          className="mt-7 text-5xl leading-[1.05] font-semibold tracking-tight text-balance text-foreground sm:text-7xl"
        >
          Know where your money goes,{" "}
          <span className="bg-gradient-to-r from-primary via-sky-300 to-accent bg-clip-text text-transparent">
            before it's gone
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg"
        >
          Budgets for every goal, receipts scanned by AI, and an assistant that
          tells you what changed and what to do about it.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            className="h-11 w-full px-6 shadow-[0_8px_30px_-6px_rgb(38_121_243/0.6)] sm:w-auto"
            asChild
          >
            <Link to={isSignedIn ? "/dashboard" : "/sign-up"}>
              {isSignedIn ? "Open dashboard" : "Start budgeting free"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 w-full border-white/10 bg-white/[0.02] px-6 text-foreground hover:bg-white/5 sm:w-auto"
            asChild
          >
            <a href="#features">Explore features</a>
          </Button>
        </motion.div>

        <motion.ul
          variants={fadeUp}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground"
        >
          {REASSURANCES.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-success" aria-hidden />
              {item}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <div
        ref={previewRef}
        className="relative mx-auto mt-16 max-w-6xl px-4 [perspective:2000px] sm:mt-20 sm:px-6"
      >
        <motion.div
          style={{ rotateX, scale, transformOrigin: "50% 0%" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <ProductPreview />

          {/* Floating UI cards around the preview */}
          <div
            aria-hidden
            className="animate-float absolute -top-7 right-6 hidden w-60 rounded-xl border border-sky-400/25 bg-popover/90 p-3 shadow-2xl backdrop-blur-md lg:block xl:-right-8"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-400/15 text-sky-300">
                <ScanLine className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Receipt scanned
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Whole Foods · $84.20 · Food
                </p>
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="animate-float-slow absolute -right-2 -bottom-10 hidden w-64 rounded-xl border border-orange-400/25 bg-popover/90 p-3 shadow-2xl backdrop-blur-md lg:block xl:-right-8"
          >
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-400/15 text-orange-300">
                <BellRing className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground">
                  Travel is at 92% of budget
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-warning to-orange-400" />
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="animate-float absolute -bottom-14 -left-2 hidden w-72 rounded-xl border border-accent/30 bg-popover/90 p-3.5 shadow-2xl backdrop-blur-md sm:block xl:-left-8"
          >
            <div className="flex items-start gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">
                  Ask Budgetly
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground">
                  Food is 38% of your spending this month, $60 more than last
                  month.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
