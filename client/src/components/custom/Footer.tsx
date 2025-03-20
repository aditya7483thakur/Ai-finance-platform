const Footer = () => {
  return (
    <>
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Finta Platform Inc. All rights
              reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-blue-500">
              Terms and conditions
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-500">
              Privacy policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-500">
              Security
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
