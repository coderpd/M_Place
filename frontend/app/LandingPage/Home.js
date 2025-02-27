import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

export default function Home() {
  return (
    <section
      id="Home"
      className="relative py-20 px-6 sm:px-12 lg:px-24 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <div className="flex justify-center">
          <div className="relative top-[50px] w-full max-w-lg shadow-lg rounded-2xl overflow-hidden">
            <Image
              src="/c-class3.jpg"
              alt="C-Class IT Products"
              width={900}
              height={600}
              className="rounded-2xl object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center  md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-20 -mt-[50px] -ml-[500px] text-center">
            Struggling with C-Class IT Procurement? Let Us Handle It for You!
          </h1>
          <h2 className="text-[32px] font-bold text-gray-800 leading-tight mb-6 text-center">
            B2B IT Procurement for{" "} <br />
            <span className="text-indigo-700">
              C-Class & Select A/B-Class Items
            </span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            This platform specializes in sourcing{" "}
            <span className="font-semibold text-indigo-600">C-Class</span> IT
            products, along with low-volume A- and B-class items such as
            Desktops, Laptops, Servers, entry-level Cisco Switches, Cisco
            Routers, basic Firewalls, and Wi-Fi Routers.
          </p>
            
          <p className="text-lg text-gray-700 mt-8 leading-relaxed">
            We cater exclusively to B2B clients, and{" "}
            <span className="font-semibold text-indigo-700">
              GST registration
            </span>{" "}
            is mandatory for both our clients and IT suppliers. While we do not
            trade goods, we provide this as a{" "}
            <span className="font-semibold text-indigo-600">
              value-added service
            </span>{" "}
            rather than a revenue-focused offering.
          </p>

          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            If clients need assistance in managing the{" "}
            <span className="font-semibold text-indigo-700">
              entire purchase order process
            </span>
            , including delivery follow-up, we offer this as an additional paid
            service.
          </p>
        </div>
      </div>
    </section>
  );
}
