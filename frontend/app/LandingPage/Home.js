import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

export default function Home() {
  return (
    <section
      id="Home"
      className="relative py-16 px-8 md:px-20 lg:px-32 bg-gradient-to-r from-slate- via-gray300 to-gray-200"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image Section */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-lg shadow-2xl rounded-xl overflow-hidden">
            <Image
              src="/c-class.jpg"
              alt="C-Class IT Products"
              width={900}  
              height={600} 
              className="rounded-xl object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 leading-snug mb-8">
            B2B IT Procurement for C-Class & Select A/B-Class Items
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            This platform is specifically designed for sourcing{" "}
            <span className="font-semibold text-indigo-600"> C-Class </span> IT
            products, along with low-volume A- and B-class items such as Desktops,
            Laptops, Servers, entry-level Cisco Switches, Cisco Routers, basic
            Firewalls, and Wi-Fi Routers.
          </p>

          {/* Feature List */}
          <ul className="space-y-6 text-gray-800 text-lg font-medium">
            <li className="flex items-center gap-4">
              <FaCheckCircle className="text-green-600 w-6 h-6" />
              <span>High-performance Desktops, Laptops & Servers</span>
            </li>
            <li className="flex items-center gap-4">
              <FaCheckCircle className="text-green-600 w-6 h-6" />
              <span>Cisco Switches, Routers & Firewalls</span>
            </li>
            <li className="flex items-center gap-4">
              <FaCheckCircle className="text-green-600 w-6 h-6" />
              <span>Secure Wi-Fi Routers & Networking Equipment</span>
            </li>
          </ul>

          <p className="text-lg text-gray-700 mt-8 leading-relaxed">
            We cater exclusively to B2B clients, and GST registration is
            mandatory for both our clients and IT suppliers. While we do not
            engage in the trading of goods, we offer this service purely as a
            value-added offering without focusing on revenue generation.
            However, if clients require assistance in managing the entire
            purchase order process, including delivery follow up, we are able to
            provide this service for an additional fee.
          </p>
        </div>
      </div>
    </section>
  );
}
