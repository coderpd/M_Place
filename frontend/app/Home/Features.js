import { FaLaptop, FaServer, FaNetworkWired } from "react-icons/fa";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-16 px-6 md:px-12 lg:px-20 bg-gradient-to-r from-[#FBF6F0] via-[#f9f9f9] to-[#FBF6F0]"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6 font-serif">
          B2B IT Procurement Services for C-Class and Select A- & B-Class Items
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto font-sans">
          A specialized platform for sourcing C-class IT products, along with select low-volume A- and B-class items such as Desktops, Laptops, Servers, entry-level Cisco Switches, Routers, basic Firewalls, Wi-Fi routers, and more.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 relative">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center absolute -top-8 left-1/2 transform -translate-x-1/2 shadow-md">
            <FaLaptop className="text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-12 mb-4 font-serif">IT Hardware</h3>
          <p className="text-gray-700 text-base font-sans">
            Laptops, Desktops, and essential IT equipment for business needs.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 relative">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center absolute -top-8 left-1/2 transform -translate-x-1/2 shadow-md">
            <FaServer className="text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-12 mb-4 font-serif">Servers & Storage</h3>
          <p className="text-gray-700 text-base font-sans">
            Reliable server solutions for business growth and data management.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 relative">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center absolute -top-8 left-1/2 transform -translate-x-1/2 shadow-md">
            <FaNetworkWired className="text-3xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-12 mb-4 font-serif">Networking Solutions</h3>
          <p className="text-gray-700 text-base font-sans">
            Cisco switches, Routers, and basic Firewalls for seamless connectivity.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center mt-12">
        <p className="text-lg text-gray-700 leading-relaxed font-sans">
          We cater exclusively to B2B clients, and GST registration is mandatory for both our clients and IT suppliers. While we do not engage in the trading of goods, we offer this service purely as a value-added offering without focusing on revenue generation. However, if clients require assistance in managing the entire purchase order process, including delivery follow-up, we are able to provide this service for an additional fee.
        </p>
      </div>
    </section>
  );
}
