import Link from "next/link";
import { Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-10 lg:py-12 w-full">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16 2xl:gap-20 text-center sm:text-left">
        
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center sm:items-start space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-4 xl:space-y-6">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-18 lg:h-18 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
            <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center border border-gray-300 shadow-inner">
              <img
                src="/Logo.png"
                alt="MPlace Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 object-contain"
              />
            </div>
          </div>
          <p className="text-xs sm:text-sm md:text-[0.9rem] lg:text-sm xl:text-base 2xl:text-base font-medium text-gray-400 text-center sm:text-left">
            Connecting businesses with trust and transparency. <br />
            © {new Date().getFullYear()} MPlace. All Rights Reserved.
          </p>
        </div>

        {/* Legal Information */}
        <div className="flex flex-col items-center sm:items-start space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-4 xl:space-y-6 2xl:space-y-7">
          <h4 className="text-lg sm:text-xl md:text-[1.25rem] lg:text-xl xl:text-2xl 2xl:text-2xl font-semibold text-white">
            Legal & Policies
          </h4>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-[0.9rem] lg:text-sm xl:text-base 2xl:text-base text-gray-400">
            <li>
              <Link
                href="/policy"
                className="hover:text-gray-200 transition duration-200"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/legal"
                className="hover:text-gray-200 transition duration-200"
              >
                Legal Disclaimer
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center sm:items-end space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-5 xl:space-y-7 2xl:space-y-8">
          <h4 className="text-lg sm:text-xl md:text-[1.25rem] lg:text-xl xl:text-2xl 2xl:text-2xl font-semibold text-white">
            Stay Connected
          </h4>
          <p className="text-gray-400 text-xs sm:text-sm md:text-[0.9rem] lg:text-sm xl:text-base 2xl:text-base text-center sm:text-right">
            Follow us on LinkedIn for updates, insights, and more.
          </p>
          <div className="flex space-x-4 sm:space-x-5 md:space-x-6">
            <a
              href="https://www.linkedin.com/company/teckost-it-services-pvt-ltd/posts/?feedView=all&viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition duration-300 transform hover:scale-110 lg:hover:scale-115 xl:hover:scale-125"
            >
              <Linkedin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}