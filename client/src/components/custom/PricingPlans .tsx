import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingPlans() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Main Title */}
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Simple, Transparent <span className="text-blue-500"> Pricing </span>
          </h2>

          {/* Subtitle with attention-grabbing offer */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Get started today and enjoy{" "}
            <span className="font-semibold text-green-400">FREE access</span> to
            all features for this year! No hidden fees, no surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto blur-xs">
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold mb-2">Basic</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Perfect for tracking your personal finances
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>

            <Button className="w-full mb-6">Start Free</Button>

            <ul className="space-y-3">
              {[
                "Track daily expenses",
                "Set monthly budgets",
                "View monthly reports",
                "Email notifications",
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="text-green-500 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-primary text-white p-8 rounded-xl shadow-lg relative border border-blue-500 transform md:-translate-y-4 md:scale-105"
          >
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <div className="bg-yellow-400 text-primary text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-blue-100 mb-6">
              Unlock advanced budgeting tools and insights
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-blue-100">/month</span>
            </div>

            <Button className="w-full mb-6 bg-white hover:bg-gray-100 text-blue-600">
              Get Started
            </Button>

            <ul className="space-y-3">
              {[
                "Everything in Basic",
                "Track recurring expenses",
                "Advanced financial insights",
                "Monthly spending goals",
                "Priority email support",
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="text-white mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold mb-2">Premium</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              For advanced users and families with multiple budgets
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold">$19.99</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
            </div>

            <Button variant="outline" className="w-full mb-6">
              Contact Sales
            </Button>

            <ul className="space-y-3">
              {[
                "Everything in Pro",
                "Multiple account tracking",
                "Custom budget categories",
                "Family financial planning",
                "24/7 priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="text-green-500 mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
