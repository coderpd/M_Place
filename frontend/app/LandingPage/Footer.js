import Link from "next/link";
import { Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-center sm:text-left">
        
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center sm:items-start space-y-3">
          <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center border border-gray-300 shadow-inner">
              <img
                src="/Logo.png"
                alt="MPlace Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-400">
            Connecting businesses with trust and transparency. <br />
            © {new Date().getFullYear()} MPlace. All Rights Reserved.
          </p>
        </div>

        {/* Legal Information */}
        <div className="flex flex-col items-center sm:items-start space-y-5">
          <h4 className="text-xl font-semibold text-white">Legal & Policies</h4>
          <ul className="space-y-2 text-sm text-gray-400">
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
        <div className="flex flex-col items-center sm:items-start space-y-6">
          <h4 className="text-xl font-semibold text-white">Stay Connected</h4>
          <p className="text-gray-400 text-sm">
            Follow us on LinkedIn for updates, insights, and more.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://www.linkedin.com/company/teckost-it-services-pvt-ltd/posts/?feedView=all&viewAsMember=true"
              target="_blank"
              className="text-gray-400 hover:text-blue-500 transition duration-300 transform hover:scale-110"
            >
              <Linkedin className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
