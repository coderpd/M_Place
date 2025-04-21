import Sidebar from "../components/navbar";
import { useState } from "react";

const mockVendors = [
  { id: 1, name: "Elite Traders", email: "elite@shop.com", status: "Active" },
  { id: 2, name: "TechGear", email: "tech@gear.com", status: "Pending" },
];

export default function Vendors() {
  const [vendors, setVendors] = useState(mockVendors);

  const approveVendor = (id) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: "Active" } : v));
  };

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-5">Vendor Profiles</h1>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="border-b">
                <td className="p-2">{vendor.name}</td>
                <td className="p-2">{vendor.email}</td>
                <td className="p-2">{vendor.status}</td>
                <td className="p-2">
                  {vendor.status === "Pending" && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => approveVendor(vendor.id)}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
