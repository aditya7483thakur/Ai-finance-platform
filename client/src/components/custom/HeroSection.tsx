const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-12 px-4 md:px-20 lg:px-40">
        <div className="mb-4">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm">
            The Smarter Way to Manage Money!
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Turn Your Finances
          <br />
          from Chaos to Control!
        </h1>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Track expenses, set budgets, and gain financial clarity—instantly.
          <br />
          Because managing money shouldn’t be complicated.
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="#"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Sign up →
          </a>
        </div>
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
    </>
  );
};

export default HeroSection;
