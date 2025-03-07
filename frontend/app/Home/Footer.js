import { Linkedin, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-semibold text-lg">
              M
            </div>
            <span className="text-xl font-semibold text-white">M-Place</span>
          </div>
          <p className="text-xs text-gray-400">
            Copyright © {new Date().getFullYear()} bidz.ai. All Rights Reserved.
          </p>
        </div>

        {/* Spacer for Layout */}
        <div></div>

        {/* Legal Section */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h4 className="text-sm font-semibold text-white text-center md:text-left">Legal</h4>
          <ul className="space-y-2 text-xs text-gray-400 text-center md:text-left">
            <li>
              <a href="#" className="hover:text-white transition duration-200">
                Terms and Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition duration-200">
                Legal Disclaimer
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition duration-200">
                Cookie Policy
              </a>
            </li>
          </ul>

          {/* Social Media Icons */}
          <div className="flex space-x-6 justify-center pt-4">
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-500 transition duration-200">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition duration-200">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-red-500 transition duration-200">
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
