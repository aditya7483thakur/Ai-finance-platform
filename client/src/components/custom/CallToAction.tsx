import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/userContext";

const CallToAction = () => {
  const { isSignedIn } = useUserContext();

  return (
    <section className="pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-beam rounded-[2rem]">
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-card px-6 py-20 text-center sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(55% 90% at 50% 110%, rgb(38 121 243 / 30%) 0%, rgb(99 102 241 / 12%) 45%, transparent 75%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_70%_at_50%_100%,black,transparent)]"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(255 255 255 / 5%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 5%) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
                Your next budget starts in under a minute
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-pretty text-muted-foreground sm:text-lg">
                Free to use, every feature included. No bank login, no card.
              </p>
              <Button
                size="lg"
                className="mt-9 h-11 px-6 shadow-[0_8px_30px_-6px_rgb(38_121_243/0.6)]"
                asChild
              >
                <Link to={isSignedIn ? "/dashboard" : "/sign-up"}>
                  {isSignedIn ? "Open dashboard" : "Create your free account"}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
