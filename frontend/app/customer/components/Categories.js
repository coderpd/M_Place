"use client";
import { useState } from "react";
import Link from "next/link";

const categories = [
  {
    name: "IT Consumables",
    subcategories: [
      "Printing Consumables",
      "Storage Media",
      "Batteries",
      "Cables and Adapters",
    ],
  },
  {
    name: "IT Peripherals",
    subcategories: [
      "Input Devices",
      "Networking Peripherals",
    ],
  },
  {
    name: "IT Accessories",
    subcategories: [
      "Computer Accessories",
      "Office Accessories"
    ],
  },
  {
    name: "Hardware",
    subcategories: [
      "Desktops & Laptops",
      "Networking Equipment",
      "Servers & Storage",
      "Peripherals & Accessories",
      "Mobile Devices",
      "Audio & Video Equipment"
    ],
  },
  {
    name: "Software",
    subcategories: [
      "Operating Systems",
      "Productivity Software",
      "Security Software",
      "Development Tools",
      "Graphics & Design Software"
    ],
  },
  {
    name: "Networking",
    subcategories: [
      "Network Infrastructure",
      "Wireless Networking",
      "Network Security",
      "Network Management Tools"   
    ],
  },
 
];

const CategoryMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="relative w-full bg-gray-50 shadow-md font-sans">
      <nav className="flex flex-wrap justify-between sm:space-x-8 px-6 py-4 text-gray-800 font-semibold">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative group sm:mr-4 mb-4 sm:mb-0 w-full sm:w-auto"
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <button className="w-full sm:w-auto text-left hover:text-blue-600 transition">
              {category.name}
            </button>

            {/* Dropdown */}
            {activeCategory === category.name && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white border rounded-md shadow-lg z-50">
                <ul className="py-2 text-md text-gray-700">
                  {category.subcategories.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        href={`/category/${sub.replace(/\s+/g, "-").toLowerCase()}`}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default CategoryMenu;
