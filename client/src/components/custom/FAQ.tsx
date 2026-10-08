import { Plus } from "lucide-react";

// Answers must stay accurate to the product (see server/domains/*).
const QUESTIONS = [
  {
    q: "Is Budgetly free?",
    a: "Yes. Every feature, including Ask Budgetly and receipt scanning, is free to use.",
  },
  {
    q: "Do I need to connect my bank?",
    a: "No. You add transactions yourself, scan a receipt, or set them to repeat. Budgetly never asks for your bank login.",
  },
  {
    q: "When do budget alerts go out?",
    a: "When spending in an account reaches 90% of its monthly budget, you get an email. You'll get at most one alert per account per day.",
  },
  {
    q: "What powers Ask Budgetly and receipt scanning?",
    a: "Google's Gemini models. They read your receipts to fill in transactions and answer questions using your accounts and spending.",
  },
  {
    q: "How is my password stored?",
    a: "Passwords are hashed with bcrypt before they're saved, so they're never stored in plain text.",
  },
  {
    q: "Which currencies are supported?",
    a: "Amounts are currently shown in US dollars.",
  },
];

const FAQ = () => (
  <section id="faq" className="scroll-mt-20 py-28">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:gap-16">
      <div>
        <p className="text-sm font-medium text-primary">FAQ</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
          Questions, answered
        </h2>
        <p className="mt-4 text-pretty text-muted-foreground">
          Something else on your mind? Open an issue on{" "}
          <a
            href="https://github.com/aditya7483thakur/Ai-finance-platform/issues"
            target="_blank"
            rel="noreferrer"
            className="text-foreground underline decoration-white/30 underline-offset-4 hover:decoration-white"
          >
            GitHub
          </a>
          .
        </p>
      </div>

      <div className="divide-y divide-white/8 border-y border-white/8 lg:col-span-2">
        {QUESTIONS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-base font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FAQ;
