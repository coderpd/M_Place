import Image from "next/image";

export default function Home() {
  return (
    <section
      id="Home"
      className="relative py-20 px-6 sm:px-12 lg:px-24 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300"
    >
      {/* Centered Heading */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-[Inter] text-gray-900 leading-tight tracking-tight">
          Struggling with C-Class IT Procurement? Let Us Handle It for You!
        </h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 font-[Inter] gap-12 items-stretch h-full">
        {/* Image Section */}
        <div className="flex justify-center md:justify-end h-full">
          <div className="relative w-full max-w-lg shadow-lg rounded-2xl overflow-hidden h-[400px]">
            <Image
              src="/c-class3.jpg"
              alt="C-Class IT Products"
              width={900}
              height={100}
              className="rounded-2xl object-cover h-full w-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center text-center md:text-left space-y-6 h-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            B2B IT Procurement for{" "}
            <span className="text-indigo-700">C-Class & Select A/B-Class Items</span>
          </h2>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed tracking-tight">
            This platform specializes in sourcing{" "}
            <span className="font-semibold text-indigo-600">C-Class</span> IT
            products, along with low-volume A- and B-class items such as
            Desktops, Laptops, Servers, entry-level Cisco Switches, Cisco
            Routers, basic Firewalls, and Wi-Fi Routers.
          </p>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed tracking-tight">
            We cater exclusively to B2B clients, and{" "}
            <span className="font-semibold text-indigo-700">GST registration</span>{" "}
            is mandatory for both our clients and IT suppliers. While we do not
            trade goods, we provide this as a{" "}
            <span className="font-semibold text-indigo-600">value-added service</span>{" "}
            rather than a revenue-focused offering.
          </p>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed tracking-tight">
            If clients need assistance in managing the{" "}
            <span className="font-semibold text-indigo-700">entire purchase order process</span>,
            including delivery follow-up, we offer this as an additional paid service.
          </p>
        </div>
      </div>
    </section>
  );
}
