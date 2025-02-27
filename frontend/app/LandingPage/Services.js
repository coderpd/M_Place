import React from "react";
import { Briefcase, DollarSign, ShieldCheck } from "lucide-react";

const servicesData = [
  {
    title: "Platform for Seamless Connections",
    description:
      "MPlace serves as a platform connecting customers and suppliers without any monetary benefits. However, if clients opt for our services to facilitate purchase order (PO) processing and supplier follow-ups for deliveries, a service fee applies.",
  },
  {
   
    title: "Direct Transactions for Transparency",
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
      className="bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-6 md:px-12"
      id="services"
    >
      {/* Section Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Our Services</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Connecting customers and suppliers with trust, efficiency, and unparalleled service.
        </p>
      </div>

      {/* Service Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
           
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">{service.title}</h3>
            <p className="text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Get Started?</h3>
        <p className="text-lg text-gray-600 mb-8">
          Let us guide you through the process and help you build a lasting business relationship.
        </p>
        <a
          href="#ContactSection"
          className="inline-block px-10 py-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-lg shadow-lg hover:bg-gradient-to-l transition duration-300 transform hover:scale-105"
        >
          Contact Us Now
        </a>
      </div>
    </section>
  );
};

export default Services;
