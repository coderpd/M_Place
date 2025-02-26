import Link from "next/link";
import { Linkedin } from "lucide-react";



export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 ml-[160px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Logo and Copyright */}
        <div className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left">
          <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl shadow-lg bg-gradient-to-br from-blue-600 to-indigo-500 p-1">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center border border-gray-300 shadow-inner">
              <img src="/Logo.png" alt="M-Place Logo" className="w-16 h-16 object-contain" />
            </div>
          </div>
          <p className="text-sm font-light">
            © {new Date().getFullYear()} MPlace All Rights Reserved.
          </p>
        </div>

        {/* Company Info */}
        <div className="flex flex-col items-center md:items-start space-y-5">
          <h4 className="text-lg font-semibold text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition duration-200">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition duration-200">
                Legal Disclaimer
              </Link> 
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-start space-y-6">
          <h4 className="text-lg font-semibold text-white">Follow Us</h4>
          <div className="flex space-x-6">
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-500 transition duration-300 transform hover:scale-110">
              <Linkedin className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}