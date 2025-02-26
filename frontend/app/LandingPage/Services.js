import React from "react";

const Services = () => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-200 py-16 px-4 md:px-8" id="services">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Our Services
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Connecting customers and suppliers with trust, efficiency, and unparalleled service.
        </p>
      </div>

      {/* Service Info */}
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-10 sm:p-12">
        <div className="space-y-8">
          <div className="service-card">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Platform for Seamless Connections</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              MPlace serves as a platform connecting customers and suppliers without any monetary benefits. However, if clients opt for our services to facilitate purchase order (PO) processing and supplier follow-ups for deliveries, a service fee applies.
            </p>
          </div>
          
          <div className="service-card">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Direct Transactions for Transparency</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Otherwise, customers are responsible for placing orders and making payments directly to suppliers, with no contractual obligation to our company, as we do not engage in trading or add margins to generate revenue.
            </p>
          </div>
          
          <div className="service-card">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ensuring Trust and Credibility</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              To ensure trust and credibility, we conduct due diligence on both customers and suppliers during onboarding, requiring a nominal registration fee of ₹1,000 for validation.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Ready to Get Started?
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          Let us guide you through the process and help you build a lasting business relationship.
        </p>
        <a
          href="#contact-us"
          className="inline-block px-10 py-4 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-lg shadow-lg hover:bg-gradient-to-l transition duration-300"
        >
          Contact Us Now
        </a>
      </div>
    </div>
  );
};

export default Services;
