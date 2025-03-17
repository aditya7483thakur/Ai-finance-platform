import Navbar from "@/components/custom/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-sky-50 font-sans pt-16">
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
                        <td className="px-2 py-2 font-medium">
                          Profit / (Loss)
                        </td>
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
            <img
              src="/api/placeholder/100/30"
              alt="Relay Logo"
              className="h-6"
            />
            <img
              src="/api/placeholder/100/30"
              alt="Resend Logo"
              className="h-6"
            />
            <img
              src="/api/placeholder/100/30"
              alt="Tenor Logo"
              className="h-6"
            />
            <img
              src="/api/placeholder/100/30"
              alt="CircleBack Logo"
              className="h-6"
            />
            <img
              src="/api/placeholder/100/30"
              alt="Magic Logo"
              className="h-6"
            />
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
                    "I used Quickbooks and bookkeepers but it was slow and
                    clunky. Now Finta saves me time by auto-categorizing our
                    transactions more accurately."
                  </blockquote>
                  <div className="flex items-center">
                    <img
                      src="/api/placeholder/48/48"
                      alt="Testimonial Avatar"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-bold">Jamie Beck</p>
                      <p className="text-sm text-gray-600">
                        Founder at Beck.app
                      </p>
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
                  Create powerful custom rules to automatically categorize and
                  tag transactions.
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
              Expert tax prep, filing, and dedicated support for year-round
              peace of mind.
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
                  Finta's experts help you maximize R&D tax credits and get
                  money back from the IRS.
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

        <section className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-64 mx-auto md:mx-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-2 bg-white rounded hover:bg-blue-50 cursor-pointer">
                  <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                  <span className="text-sm">Income Statement</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white rounded hover:bg-blue-50 cursor-pointer">
                  <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                  <span className="text-sm">Balance Sheet</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white rounded hover:bg-blue-50 cursor-pointer">
                  <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                  <span className="text-sm">Cashflow Statement</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="text-xs text-gray-500">
                  Download Financials →
                </button>
              </div>
            </div>

            <div className="mt-8 text-center md:text-left">
              <div className="inline-flex items-center mb-2">
                <div className="bg-blue-500 text-white p-1 rounded-md mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-blue-500">
                  FINANCIAL STATEMENTS
                </span>
              </div>
              <p className="text-sm">
                Fundraising and 409A valuations ready with one-click download of
                your financials.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg shadow-sm p-4 max-w-md mx-auto">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 rounded p-1 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold">Finta</span>
                  <span className="text-xs text-gray-500 ml-2">
                    APP · Finance
                  </span>
                </div>
              </div>

              <p className="text-sm mb-3">
                Here's your monthly summary for Jan 2025
              </p>

              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="mr-2">💰</span>
                  <span className="text-sm">Cash: $2,309,091</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📈</span>
                  <span className="text-sm">Net Burn: -$41,206</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🏃‍♂️</span>
                  <span className="text-sm">Runway: 4y 8mo (til Sep 2031)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📊</span>
                  <span className="text-sm">MRR: $74,981</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center md:text-right">
              <div className="inline-flex items-center mb-2">
                <div className="bg-blue-500 p-1 rounded-md mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-blue-500">
                  SLACK NOTIFICATIONS
                </span>
              </div>
              <p className="text-sm">
                Get instant transaction alerts and monthly financial summaries
                in Slack.
              </p>
            </div>
          </div>
        </section>

        {/* Complete Picture Section */}
        <section className="bg-white py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-2">
              See the <span className="text-blue-500">complete picture</span>
            </h2>
            <p className="text-gray-600 mb-12">
              Seamlessly unify all of your financial data in one place and get
              the source of truth.
            </p>

            <div className="relative py-12">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-500 rounded-full p-4 inline-flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="border-t border-gray-200 w-full absolute top-1/2"></div>
            </div>

            <div className="mt-12 max-w-lg mx-auto">
              <blockquote className="text-center">
                <p className="text-gray-800 mb-4">
                  "Finta has amazing integrations with Box, Mercury, and Ramp.
                  Onboarding was super fast and smooth. Now I can finally see
                  everything in one place."
                </p>
                <footer className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3"></div>
                  <div className="text-left">
                    <div className="font-medium">Ali Naghawi</div>
                    <div className="text-xs text-gray-500">
                      Founder at Coinshack
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Ambitious Founders Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Built for{" "}
              <span className="text-blue-500">ambitious founders</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">
              Finta is built for founders, not bookkeepers. No jargon,
              confusion, manual work, or stress. Just delightful software with
              expert services we wish we had ourselves.
            </p>

            <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 mb-16">
              {/* <CheckCircle className="w-4 h-4 text-blue-500 mr-1" /> */}
              <span className="text-sm">4.8 from 200+ founders</span>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white p-4 rounded-lg shadow-sm text-left">
                <p className="text-sm mb-4">
                  "Super fast and easy integration with our current stack. Andy
                  is super knowledgeable and responsive!"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-sm">Jaimal Soni</div>
                    <div className="text-xs text-gray-500">
                      Founder at Insight Health
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-4 rounded-lg shadow-sm text-left">
                <p className="text-sm mb-4">
                  "Finta is incredible - it took less than 10 minutes to get a
                  bookkeeper for the entire year. Plus they're doing our taxes.
                  This is the easiest bookkeeping / taxes has ever been."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-sm">Bryan Lee</div>
                    <div className="text-xs text-gray-500">
                      Founder at Vision (YC W23)
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-4 rounded-lg shadow-sm text-left">
                <p className="text-sm mb-4">
                  "We used Finta for our 2024 taxes and they made the service
                  extremely easy. We use Brex and they have a direct integration
                  that only required a 5 min setup. Thanks Andy and team!"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-sm">Joe Averbush</div>
                    <div className="text-xs text-gray-500">
                      Founder at Instant (YC S22)
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional testimonials */}
              <div className="bg-white p-4 rounded-lg shadow-sm text-left">
                <p className="text-sm mb-4">
                  "Recommended Finta to a startup founder - she said onboarding
                  was super easy, took less than 10 min to reconcile her
                  expenses for the whole year and onboarding onto tax service
                  was less than 30 minutes!"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-sm">Judd Schoenholtz</div>
                    <div className="text-xs text-gray-500">
                      Founder at Heretoo
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm text-left">
                <p className="text-sm mb-4">
                  "Excellent onboarding, and really responsive team!"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-sm">Jason Lin</div>
                    <div className="text-xs text-gray-500">
                      Founder at Debuild (YC S20)
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm text-left">
                <p className="text-sm mb-4">
                  "Set up took literally 5 minutes. Andy was very professional
                  and quick—and gave us some helpful tax tips as well! Highly
                  recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-sm">Sona Sulakian</div>
                    <div className="text-xs text-gray-500">
                      Founder at Peachy (YC S23)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-2">Set up in 10 mins.</h2>
            <h3 className="text-2xl mb-4">Back to building by 10:11am.</h3>
            <p className="text-gray-400 mb-8">
              Built for founders who want to focus on their business, not their
              accounting.
            </p>

            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
              Start free trial
            </button>
          </div>
        </section>

        <footer className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-6xl mx-auto px-4">
            {/* Main Footer Content */}
            <div className="flex flex-col md:flex-row justify-between mb-12">
              {/* Brand Column */}
              <div className="mb-8 md:mb-0 md:w-1/4">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 text-white p-1 rounded mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-lg">Finta</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Magically simplify accounting and taxes for ambitious
                  founders.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-500">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-500">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Navigation Columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
                <div>
                  <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">
                    Product
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Integrations
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Bookkeeping
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Taxes
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">
                    Resources
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Blog
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Founder Resources
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Community
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">
                    Company
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Careers
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Press
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-blue-500 text-sm"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Finta Platform Inc. All rights
                  reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-500"
                >
                  Terms and conditions
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-500"
                >
                  Privacy policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-blue-500"
                >
                  Security
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
