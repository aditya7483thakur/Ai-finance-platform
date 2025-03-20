const Testimonials = () => {
  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Built for <span className="text-blue-500">ambitious founders</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Finta is built for founders, not bookkeepers. No jargon, confusion,
            manual work, or stress. Just delightful software with expert
            services we wish we had ourselves.
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
                "Super fast and easy integration with our current stack. Andy is
                super knowledgeable and responsive!"
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
                was super easy, took less than 10 min to reconcile her expenses
                for the whole year and onboarding onto tax service was less than
                30 minutes!"
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
                "Set up took literally 5 minutes. Andy was very professional and
                quick—and gave us some helpful tax tips as well! Highly
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
    </>
  );
};

export default Testimonials;
