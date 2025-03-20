const Features = () => {
  const features = [
    {
      id: 1,
      title: "Smart Budgeting",
      icon: "📊",
      description:
        "Set spending limits, track expenses, and get alerts when you're close to exceeding your budget.",
    },
    {
      id: 2,
      title: "Seamless Transactions",
      icon: "💸",
      description:
        "Easily add, categorize, and manage transactions with instant organization.",
    },
    {
      id: 3,
      title: "Multiple Accounts Management",
      icon: "💰",
      description:
        "Link multiple accounts, track balances, and view all your finances in one place.",
    },
    {
      id: 4,
      title: "Insightful Reports",
      icon: "📈",
      description:
        "Generate spending reports by category, account, or status to make informed decisions.",
    },
    {
      id: 5,
      title: "Secure & Fast Authentication",
      icon: "🔐",
      description:
        "Enjoy a seamless login experience with secure authentication.",
    },
    {
      id: 6,
      title: "Automated Expense Tracking",
      icon: "🔄",
      description:
        "Set up recurring transactions and automate bill payments effortlessly.",
    },
  ];
  return (
    <div className=" px-4 md:px-20 lg:px-40">
      <section className="py-16 px-4">
        <div className="mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Unlock the Power of AI for{" "}
            <span className="text-blue-500">Smarter Finance</span>
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Say goodbye to manual bookkeeping—let smart automation handle your
            transactions while you focus on growth.
          </p>
        </div>
      </section>
      <div className=" mx-auto flex flex-wrap justify-center gap-5">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col items-center text-center bg-white rounded-xl shadow-md border border-gray-200 p-5 w-full sm:w-[30%] transition duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-center w-16 h-16 text-4xl rounded-full bg-blue-100 text-blue-500 mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
