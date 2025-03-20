const Features = () => {
  return (
    <div>
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-100 text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-800">
                Portfolio / Resume Review
              </div>
              <div className="mt-1 bg-gray-200 h-2 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
