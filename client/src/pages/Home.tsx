const Home = () => {
  return (
    <div className="min-h-screen bg-sky-50 font-sans">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <div className="mb-4">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm">
            We're hiring a founding designer →
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Magically simplify
          <br />
          accounting and taxes
        </h1>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Automated bookkeeping, effortless tax filing, real-time insights.
          <br />
          Set up in 10 min. Back to building by 10:11am.
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="#"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Start free trial
          </a>
          <a
            href="#"
            className="text-gray-600 border border-gray-300 px-6 py-2 rounded hover:bg-gray-100"
          >
            Pricing
          </a>
        </div>
        <p className="text-xs text-gray-500">
          For US businesses • Credit cards only
        </p>
      </section>

      {/* Dashboard Preview */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="font-bold text-gray-700 mb-4">Finta</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700 font-medium">
                  <div className="w-4 h-4 mr-2 rounded bg-blue-100"></div>
                  Summary
                </li>
                <li className="flex items-center text-gray-500">
                  <div className="w-4 h-4 mr-2 rounded border border-gray-300"></div>
                  Transactions
                </li>
                <li className="flex items-center text-gray-500">
                  <div className="w-4 h-4 mr-2 rounded border border-gray-300"></div>
                  Reports
                </li>
                <li className="flex items-center text-gray-500">
                  <div className="w-4 h-4 mr-2 rounded border border-gray-300"></div>
                  Taxes
                </li>
              </ul>
            </div>
            <div className="w-full md:w-3/4">
              <h3 className="font-bold text-gray-700 mb-4">Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Cash</p>
                  <p className="text-2xl font-bold">$2,309,091</p>
                  <p className="text-xs text-gray-500">as of now</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Monthly change</p>
                  <p className="text-2xl font-bold text-red-500">-$41,206</p>
                  <p className="text-xs text-gray-500">Jan 2023</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Runway</p>
                  <p className="text-2xl font-bold">4y 8mo</p>
                  <p className="text-xs text-gray-500">from Dec 2022</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Burn</p>
                  <p className="text-2xl font-bold">$76,981</p>
                  <p className="text-xs text-gray-500">6-mo avg. rate</p>
                </div>
              </div>

              {/* Simplified Financial Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-gray-500 text-left">
                      <th className="px-2 py-2"></th>
                      <th className="px-2 py-2">Aug-22</th>
                      <th className="px-2 py-2">Sep-22</th>
                      <th className="px-2 py-2">Oct-22</th>
                      <th className="px-2 py-2">Nov-22</th>
                      <th className="px-2 py-2">Dec-22</th>
                      <th className="px-2 py-2">Jan-23</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-2 font-medium">Cash</td>
                      <td className="px-2 py-2">$1.8M</td>
                      <td className="px-2 py-2">$1.8M</td>
                      <td className="px-2 py-2">$2.3M</td>
                      <td className="px-2 py-2">$2.3M</td>
                      <td className="px-2 py-2">$2.3M</td>
                      <td className="px-2 py-2">$2.3M</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 font-medium">Profit / (Loss)</td>
                      <td className="px-2 py-2 text-red-500">($68.8K)</td>
                      <td className="px-2 py-2 text-red-500">($22.9K)</td>
                      <td className="px-2 py-2 text-red-500">($76.9K)</td>
                      <td className="px-2 py-2 text-red-500">($21.4K)</td>
                      <td className="px-2 py-2 text-red-500">($28.4K)</td>
                      <td className="px-2 py-2 text-red-500">($41.2K)</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 font-medium">Revenue</td>
                      <td className="px-2 py-2">$12.8K</td>
                      <td className="px-2 py-2">$34.6K</td>
                      <td className="px-2 py-2">$36.6K</td>
                      <td className="px-2 py-2">$35.9K</td>
                      <td className="px-2 py-2">$48.5K</td>
                      <td className="px-2 py-2">$34.4K</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-2 font-medium">Expenses</td>
                      <td className="px-2 py-2">$70.5K</td>
                      <td className="px-2 py-2">$60.0K</td>
                      <td className="px-2 py-2">$62.6K</td>
                      <td className="px-2 py-2">$57.3K</td>
                      <td className="px-2 py-2">$65.0K</td>
                      <td className="px-2 py-2">$82.8K</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="text-center py-12 px-4">
        <p className="text-sm text-gray-500 mb-6">
          Trusted by fast-growing startups
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <img src="/api/placeholder/100/30" alt="Relay Logo" className="h-6" />
          <img
            src="/api/placeholder/100/30"
            alt="Resend Logo"
            className="h-6"
          />
          <img src="/api/placeholder/100/30" alt="Tenor Logo" className="h-6" />
          <img
            src="/api/placeholder/100/30"
            alt="CircleBack Logo"
            className="h-6"
          />
          <img src="/api/placeholder/100/30" alt="Magic Logo" className="h-6" />
          <img
            src="/api/placeholder/100/30"
            alt="Platform Logo"
            className="h-6"
          />
        </div>
      </section>

      {/* Build Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Free your time to <span className="text-blue-500">build</span>
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Your time as a founder is extremely valuable. Don't waste it on
            emails or data entry.
            <br />
            Set accounting on autopilot and replace QuickBooks + manual
            bookkeepers.
          </p>

          {/* Auto Categorization */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="flex items-center gap-2 text-blue-500 mb-4">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold uppercase text-sm">
                    Auto categorization
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-4">
                  Transactions are automatically categorized and reconciled
                  accurately in real-time.
                </h3>
              </div>
              <div className="w-full md:w-2/3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        {
                          date: "Today",
                          company: "Slack",
                          category: "Software",
                          amount: "$75",
                        },
                        {
                          date: "Yesterday",
                          company: "Doordash",
                          category: "Food",
                          amount: "$30",
                        },
                        {
                          date: "Jun 27",
                          company: "Airbnb",
                          category: "Co-working",
                          amount: "$200",
                        },
                        {
                          date: "Jun 25",
                          company: "Y Combinator",
                          category: "Co-working",
                          amount: "$500,000",
                        },
                        {
                          date: "Jun 23",
                          company: "Stripe",
                          category: "Co-working",
                          amount: "$15,000",
                        },
                      ].map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 last:border-0"
                        >
                          <td className="py-3 text-gray-500 w-24">
                            {item.date}
                          </td>
                          <td className="py-3 font-medium">{item.company}</td>
                          <td className="py-3">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 text-right font-medium">
                            {item.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-gray-100 rounded-lg p-8 mb-16">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-3/4">
                <blockquote className="text-lg md:text-xl font-medium mb-6">
                  "I used Quickbooks and bookkeepers but it was slow and clunky.
                  Now Finta saves me time by auto-categorizing our transactions
                  more accurately."
                </blockquote>
                <div className="flex items-center">
                  <img
                    src="/api/placeholder/48/48"
                    alt="Testimonial Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">Jamie Beck</p>
                    <p className="text-sm text-gray-600">Founder at Beck.app</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg p-8">
              <div className="flex justify-between mb-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white text-xs"></div>
                    <p className="font-bold">Brex</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-white text-xs">
                      M
                    </div>
                    <p className="font-bold">Mercury</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">$400,000</p>
                  <p className="text-blue-500 font-bold mt-8">$300,000</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-500 mb-4">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="uppercase font-bold text-sm">
                  Easy bank transactions
                </span>
              </div>
              <p className="text-gray-700">
                Bank transfers are automatically matched and reconciled
                accurately in real-time.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8">
              <div className="flex mb-8">
                <div className="bg-gray-100 rounded-lg p-4 w-full">
                  <div className="flex justify-between mb-4">
                    <p className="font-medium">Name</p>
                    <p>Stripe</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className="font-medium">Amount</p>
                    <p>Revenue plan</p>
                  </div>
                  <div className="flex justify-between mb-4">
                    <p className="font-medium">Category</p>
                    <p>Revenue</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium">Vendor</p>
                    <p>Yearly</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-500 mb-4">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="uppercase font-bold text-sm">
                  Automated rules
                </span>
              </div>
              <p className="text-gray-700">
                Create powerful custom rules to automatically categorize and tag
                transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Tax season with <span className="text-blue-500">zero stress</span>
          </h2>
          <p className="text-center text-gray-600 mb-16">
            Expert tax prep, filing, and dedicated support for year-round peace
            of mind.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">1099s</p>
                </div>
                <div className="text-blue-500 text-sm font-medium">
                  Completed
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Delaware franchise tax</p>
                </div>
                <div className="text-blue-500 text-sm font-medium">
                  Completed
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Federal & state income tax</p>
                </div>
                <div className="text-gray-500 text-sm">Due Jan 25</div>
              </div>
            </div>

            <div>
              <img
                src="/api/placeholder/400/240"
                alt="Tax Return Document"
                className="w-full rounded-lg shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-2 text-blue-500 mb-4">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="uppercase font-bold text-sm">
                  Filing reminders
                </span>
              </div>
              <p className="text-gray-700">
                Finta's experts handle all your filing compliance needs
                accurately and on time.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center gap-2 text-blue-500 mb-4">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="uppercase font-bold text-sm">
                  Claim all tax credits
                </span>
              </div>
              <p className="text-gray-700">
                Finta's experts help you maximize R&D tax credits and get money
                back from the IRS.
              </p>
            </div>
          </div>

          {/* Second Testimonial */}
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-3/4">
                <blockquote className="text-lg md:text-xl font-medium mb-6">
                  "Finta filed our taxes and claimed $17,016 in credits. The
                  process was easy with responsive support!"
                </blockquote>
                <div className="flex items-center">
                  <img
                    src="/api/placeholder/48/48"
                    alt="Testimonial Avatar"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">Alex Domlewski</p>
                    <p className="text-sm text-gray-600">
                      Co-Founder at Beacon Payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <img
            src="/api/placeholder/100/30"
            alt="Finta Logo"
            className="h-8 mx-auto mb-6"
          />
          <p className="text-gray-500 mb-6">
            © 2025 Finta, Inc. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
