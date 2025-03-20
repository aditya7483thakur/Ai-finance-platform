"use client";

import { Mail, Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function SaaSFooter() {
  return (
    <footer className="bg-transparent text-gray-800 py-12 px-6 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold">YourSaaS</h2>
          <p className="mt-2 text-sm text-gray-600">
            The ultimate platform to manage your business with ease. Start today
            and boost your productivity!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="#" className="hover:text-gray-900">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-lg font-semibold">Stay Updated</h3>
          <p className="text-sm mt-2 text-gray-600">
            Subscribe to our newsletter for the latest updates.
          </p>
          <div className="flex items-center mt-3 bg-gray-100 rounded-lg overflow-hidden border">
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent text-gray-800 px-3 py-2 w-full focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white flex items-center">
              <Mail size={18} className="mr-1" /> Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} YourSaaS. All rights reserved.
      </div>
    </footer>
  );
}
