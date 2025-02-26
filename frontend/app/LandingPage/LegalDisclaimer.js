import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LegalDisclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Disclaimer</h1>

        <section className="text-gray-700 space-y-6">
          <h2 className="text-xl font-semibold">General Information</h2>
          <p>
            MPlace is a digital platform that facilitates connections between
            customers and suppliers without any monetary benefits. Our platform
            serves solely as a medium for interaction and does not engage in
            trading, price markups, or revenue generation through product
            transactions.
          </p>

          <h2 className="text-xl font-semibold">Service Scope</h2>
          <p>
            Customers using MPlace have the option to either engage directly
            with suppliers for order placement and payments or avail of our
            additional services for purchase order (PO) processing and supplier
            follow-ups for deliveries. These services are chargeable and are
            provided solely for the convenience of clients. MPlace does not
            assume any liability for transactions conducted directly between
            customers and suppliers outside our service scope.
          </p>

          <h2 className="text-xl font-semibold">No Commercial Binding</h2>
          <p>
            MPlace does not act as an intermediary or financial stakeholder in
            any transaction between customers and suppliers. All financial
            dealings, including payments and delivery obligations, are strictly
            between the involved parties. We hold no responsibility for product
            quality, pricing, fulfillment, delays, or disputes arising between
            customers and suppliers.
          </p>

          <h2 className="text-xl font-semibold">Due Diligence and Registration</h2>
          <p>
            To maintain trust and credibility, MPlace conducts due diligence on
            both customers and suppliers during onboarding. A nominal
            registration fee of ₹1,000 is charged for validation purposes. This
            fee is strictly for verification and does not imply any form of
            guarantee, endorsement, or liability for future interactions between
            parties.
          </p>

          <h2 className="text-xl font-semibold">Limitation of Liability</h2>
          <p>
            MPlace shall not be held liable for any direct, indirect,
            incidental, or consequential damages arising from the use of our
            platform, including but not limited to financial loss, supplier
            non-compliance, delivery delays, or quality issues. Users are
            responsible for conducting their own assessments before entering
            into any transaction.
          </p>

          <h2 className="text-xl font-semibold">Amendments</h2>
          <p>
            MPlace reserves the right to modify or update this disclaimer at any
            time without prior notice. Users are encouraged to review this page
            periodically to stay informed about any changes.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LegalDisclaimer;