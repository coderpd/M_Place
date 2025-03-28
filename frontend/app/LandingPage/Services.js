import React from "react";

const servicesData = [
  {
    title: "Platform for Seamless Connections",
    description:
      "MPlace serves as a platform connecting customers and suppliers without any monetary benefits. However, if clients opt for our services to facilitate purchase order (PO) processing and supplier follow-ups for deliveries, a service fee applies.",
  },
  {
    title: "Direct Transactions with Transparency",
    description:
      "Otherwise, customers are responsible for placing orders and making payments directly to suppliers, with no contractual obligation to our company, as we do not engage in trading or add margins to generate revenue.",
  },
  {
    title: "Ensuring Trust and Credibility",
    description:
      "To ensure trust and credibility, we conduct due diligence on both customers and suppliers during onboarding, requiring a nominal registration fee of ₹1,000 for validation.",
  },
];

const Services = () => {
  return (
    <section
      className="bg-gradient-to-b from-gray-100 to-gray-200 py-12 sm:py-16 lg:py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-32 font-[Inter]"
      id="services"
    >
      {/* Section Header */}
      <div className="text-center mb-10 md:mb-12 lg:mb-14">
        <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] lg:text-5xl xl:text-[3.5rem] 2xl:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Our Services
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-[1.25rem] xl:text-2xl text-gray-700 max-w-3xl mx-auto tracking-tight mt-4 sm:mt-5">
          Connecting customers and suppliers with trust, efficiency, and unparalleled service.
        </p>
      </div>

      {/* Service Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-8 xl:gap-10 2xl:gap-12">
        {servicesData.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 sm:p-7 md:p-8 lg:p-7 xl:p-8 2xl:p-10 rounded-xl lg:rounded-2xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 hover:scale-[1.02]"
          >
            <h3 className="text-xl sm:text-2xl md:text-[1.35rem] lg:text-2xl xl:text-[1.75rem] 2xl:text-3xl font-semibold text-indigo-700 mb-3 sm:mb-4 tracking-tight">
              {service.title}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base md:text-[0.95rem] lg:text-base xl:text-lg 2xl:text-xl tracking-tight">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 sm:mt-14 md:mt-16 lg:mt-18">
        <h3 className="text-xl sm:text-2xl md:text-[1.5rem] lg:text-3xl xl:text-4xl font-semibold text-gray-800 mb-3 sm:mb-4 tracking-tight">
          Ready to Get Started?
        </h3>
        <p className="text-base sm:text-lg md:text-xl lg:text-[1.15rem] xl:text-2xl text-gray-600 mb-6 sm:mb-8 tracking-tight">
          Let us guide you through the process and help you build a lasting business relationship.
        </p>
        <a
          href="#ContactSection"
          className="inline-block px-8 sm:px-9 md:px-10 lg:px-10 xl:px-12 py-3 sm:py-3.5 md:py-4 lg:py-3.5 xl:py-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-base sm:text-lg md:text-[1.05rem] lg:text-lg xl:text-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Contact Us Now
        </a>
      </div>
    </section>
  );
};

export default Services;