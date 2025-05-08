import Image from "next/image";

export default function Home() {
  return (
    <section
      id="Home"
      className="relative py-12 md:py-16 lg:py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300"
    >
      {/* Centered Heading */}
      <div className="text-center mb-8 md:mb-10 lg:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.7rem] xl:text-5xl font-extrabold font-[Inter] text-gray-900 leading-tight tracking-tight">
          Struggling  C-Class IT Procurement? Let Us Handle It for You!
        </h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 font-[Inter] gap-8 md:gap-10 lg:gap-12 xl:gap-16 2xl:gap-20 items-center">
        {/* Image Section - Order changes on mobile */}
        <div className="order-1 md:order-2 flex justify-center h-full">
          <div className="relative w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl shadow-lg rounded-xl lg:rounded-2xl overflow-hidden h-[300px] sm:h-[350px] md:h-[300px] lg:h-[400px] xl:h-[450px] 2xl:h-[500px]">
            <Image
              src="/c-class3.jpg"
              alt="C-Class IT Products"
              fill
              priority
              className="object-cover h-full w-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Text Content - Order changes on mobile */}
        <div className="order-2 md:order-1 flex flex-col justify-center text-center md:text-left space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7 xl:space-y-8">
          <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 tracking-tight">
            B2B IT Procurement for{" "}
            <span className="text-indigo-700">C-Class & Select A/B-Class Items</span>
          </h2>

          <p className="text-sm sm:text-base md:text-[0.95rem] lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed sm:leading-relaxed tracking-tight">
            This platform specializes in sourcing{" "}
            <span className="font-semibold text-indigo-600">C-Class</span> IT
            products, along with low-volume A and B-class items such as
            Desktops, Laptops, Servers, entry-level Cisco Switches, Cisco
            Routers, basic Firewalls, and Wi-Fi Routers.
          </p>

          <p className="text-sm sm:text-base md:text-[0.95rem] lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed sm:leading-relaxed tracking-tight">
            We cater exclusively to B2B clients, and{" "}
            <span className="font-semibold text-indigo-700">GST registration</span>{" "}
            is mandatory for both our clients and IT suppliers. While we do not
            trade goods, we provide this as a{" "}
            <span className="font-semibold text-indigo-600">value-added service</span>{" "}
            rather than a revenue-focused offering.
          </p>

          <p className="text-sm sm:text-base md:text-[0.95rem] lg:text-base xl:text-lg 2xl:text-xl text-gray-700 leading-relaxed sm:leading-relaxed tracking-tight">
            If clients need assistance in managing the{" "}
            <span className="font-semibold text-indigo-700">entire purchase order process</span>,
            including delivery follow-up, we offer this as an additional paid service.
          </p>
        </div>
      </div>
    </section>
  );
}