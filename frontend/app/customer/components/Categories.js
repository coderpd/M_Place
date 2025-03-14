"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ProductsPage from "../products/page";

const categories = [
  {
    name: "IT Consumables",
    subcategories: [
      {
        name: "Printing Consumables",
        items: [
          "Ink Cartridges (Black, Color)",
          "Toner Cartridges (Monochrome, Color)",
          "Printer Ribbons (Impact Printers)",
          "Maintenance Kits (Fuser Kits, Roller Kits)",
          "Drum Units",
          "Printer Paper (A4, A3, Specialty Paper)",
          "Label Paper (Adhesive Labels, Shipping Labels)",
          "Fax Paper (Thermal Paper Rolls)",
          "Photographic Paper",
        ],
      },
      {
        name: "Storage Media",
        items: [
          "USB Flash Drives (Various Capacities)",
          "External Hard Drives (HDDs, SSDs)",
          "Memory Cards (SD, MicroSD, CompactFlash)",
          "Backup Tapes (LTO, DAT, DLT)",
          "Optical Media (Blank Discs, RW Discs)",
        ],
      },
      {
        name: "Batteries",
        items: [
          "Rechargeable Batteries (NiMH, Lithium-Ion)",
          "Laptop Batteries",
          "UPS Batteries",
          "CMOS Batteries (CR2032, CR2025)",
        ],
      },
      {
        name: "Cables & Adapters",
        items: [
          "Ethernet Cables (Cat5e, Cat6, Cat7)",
          "USB Cables (USB-A, USB-C, Micro USB)",
          "HDMI Cables (Standard, Mini, Micro)",
          "DisplayPort Cables",
          "VGA Cables",
          "Power Cables (IEC, Laptop Adapters)",
          "Audio Cables (3.5mm, RCA, Optical)",
          "Phone Cables (RJ11)",
          "Adapters (USB to HDMI, USB to Ethernet, VGA to HDMI)",
          "Charging Cables (Lightning, USB-C, Micro-USB)",
        ],
      },
    ],
  },
  {
    name: "IT Peripherals",
    subcategories: [
      {
        name: "Input Devices",
        items: [
          "Keyboard (Wired, Wireless, Ergonomic, Gaming)",
          "Mice (Wired, Wireless, Optical, Laser, Gaming)",
          "Trackballs",
          "Graphic Tablets & Styluses",
          "Touchpads",
          "Barcode Scanners (Wired, Wireless, Handheld)",
          "ascadca"
        ],
      },
      {
        name: "Output Devices",
        items: [
          "Monitors (Standard, 4K, Curved)",
          "Printers (Inkjet, Laser, Dot Matrix)",
          "Scanners (Flatbed, Document, Barcode)",
          "Label Printers",
          "Projectors (Portable, Office, Home Theater)",
          "Speakers (Desktop, Bluetooth, USB)",
          "Headsets (Wired, Wireless, Noise-Cancelling)",
          "Webcams (Standard, HD, 4K)",
          "Microphones (Desktop, USB, XLR)",
        ],
      },
      {
        name: "Networking Peripherals",
        items: [
          "Routers (Basic, Enterprise)",
          "Switches (Unmanaged, Managed, PoE)",
          "Wi-Fi Extenders",
          "Access Points (Indoor, Outdoor, Mesh)",
          "Network Adapters (Wi-Fi, Bluetooth, Ethernet)",
          "USB Hubs (Standard, Powered)",
          "KVM Switches (Keyboard, Video, Mouse)",
          "Modems (DSL, Cable, Fiber)",
        ],
      },
    ],
  },
  {
    name: "IT Accessories",
    subcategories: [
      {
        name: "Computer Accessories",
        items: [
          "Laptop Bags & Sleeves",
          "Laptop Stands & Cooling Pads",
          "Mouse Pads & Wrist Rests",
          "USB Hubs",
          "Monitor Mounts & Stands",
        ],
      },
      {
        name: "Office Accessories",
        items: [
          "Surge Protectors & Power Strips",
          "Extension Cords",
          "Desk Organizers",
          "Label Makers & Tapes",
        ],
      },
      {
        name: "Mobile Accessories",
        items: ["Power Banks", "Bluetooth Headsets", "Mobile Charging Cables "],
      },
    ],
  },
  {
    name: "Hardware",
    subcategories: [
      {
        name: "Monitors & Laptops",
        items: [
          "Monitors (Basic, High-Performance, All-in-One)",
          "Laptops (Business, Gaming, Ultrabooks)",
          "Workstations (Engineering, Graphic Design, Video Editing)",
          "Thin Clients",
          "Chromebooks",
          "Tablets (iPads, Android Tablets, Windows Tablets)",
        ],
      },

      {
        name: "Servers & Storage",
        items: [
          "Servers (Rack, Tower, Blade, Modular, Microservers)",
          "NAS (Network Attached Storage)",
          "SAN (Storage Area Network)",
          "DAS (Direct Attached Storage)",
          "SSDs (SATA, NVMe)",
          "HDDs (Enterprise, Consumer)",
        ],
      },
      {
        name: "Mobile Devices",
        items: [
          "Mobile Phones (iOS, Android)",
          "E-Readers (Kindle, Kobo)",
          "Wearables (Smartwatches, Fitness Trackers)",
          "Tablets",
        ],
      },
      {
        name: "Audio & Video Equipment",
        items: [
          "Cameras (DSLR, Mirrorless, Action, Security)",
          "Camcorders",
          "Video Conferencing Systems",
          "AV Receivers",
          "Projector Screens",
        ],
      },
    ],
  },
  {
    name: "Software",
    subcategories: [
      {
        name: "Operating Systems",
        items: [
          "Windows (Home, Pro, Enterprise)",
          "macOS",
          "Linux Distributions (Ubuntu, CentOS, Red Hat, Fedora)",
        ],
      },
      {
        name: "Productivity Software",
        items: [
          "Office Suites (Microsoft Office, Google Workspace, LibreOffice)",
          "Project Management Tools (Asana, Trello, Microsoft Project)",
          "Collaboration Tools (Slack, Microsoft Teams, Zoom)",
          "Email Clients (Outlook, Thunderbird)",
        ],
      },
      {
        name: "Security Software",
        items: [
          "Antivirus & Anti-malware (Norton, McAfee, Bitdefender)",
          "Firewalls (ZoneAlarm, Comodo)",
          "VPN Software (NordVPN, ExpressVPN, OpenVPN)",
          "Encryption Tools (VeraCrypt, BitLocker)",
          "Endpoint Security (CrowdStrike, Symantec)",
        ],
      },
      {
        name: "Graphics & Design Software",
        items: [
          " Graphic Design (Adobe Photoshop, Illustrator, CorelDRAW)",
          "Video Editing (Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve)",
          "3D Modeling (AutoCAD, Blender, SketchUp)",
          "Animation (Maya, After Effects, Toon Boom)",
          "CAD/CAM Software (SolidWorks, AutoCAD, Fusion 360)",
        ],
      },
    ],
  },
  {
    name: "Networking",
    subcategories: [
      {
        name: "Network Infrastructure",
        items: [
          "Routers (Enterprise, Home, Wireless)",
          "Switches (Core, Distribution, Access, PoE)",
          "Network Cabling (Ethernet, Fiber Optic, Coaxial)",
          "Network Interface Cards (NICs)",
        ],
      },
      {
        name: "Wireless Networking",
        items: [
          "Wireless Access Points (Wi-Fi 6, Mesh Systems)",
          "Wireless Controllers",
          "Wi-Fi Extenders",
          "Wireless Antennas",
        ],
      },

      {
        name: "Network Management Tools",
        items: [
          "Network Monitoring (SolarWinds, Nagios, PRTG)",
          "Network Configuration Management (Cisco Prime, SolarWinds)",
          "Bandwidth Management Tools (NetFlow, Zabbix)",
          "Network Analysis Tools (Wireshark, Omnipeek)",
          "Network Simulation & Testing Tools (GNS3, Cisco Packet Tracer)",
        ],
      },
    ],
  },
];

const CategoryMenu = ({ setCategoryFilter }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("left-0");

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const categoryRefs = useRef({});

  const handleMouseEnterCategory = (categoryName, index) => {
    clearTimeout(timeoutId); // Clear any existing timeout
    setActiveCategory(categoryName);
    setActiveSubcategory(null);

    // Check dropdown position dynamically
    if (categoryRefs.current[index]) {
      const rect = categoryRefs.current[index].getBoundingClientRect();
      const windowWidth = window.innerWidth;

      if (rect.right + 260 > windowWidth) {
        setDropdownPosition("right-0"); // Shift to left if overflow
      } else {
        setDropdownPosition("left-0"); // Default to right
      }
    }
    setDropdownVisible(true); // Show dropdown when hovered
  };

  const handleMouseLeaveCategory = () => {
    const newTimeoutId = setTimeout(() => {
      setDropdownVisible(false); // Hide dropdown after delay
    }, 200); // Delay before hiding the dropdown

    setTimeoutId(newTimeoutId);
  };

  const handleMouseEnterDropdown = () => {
    clearTimeout(timeoutId); // Clear the timeout to keep dropdown visible
  };

  const handleMouseLeaveDropdown = () => {
    const newTimeoutId = setTimeout(() => {
      setDropdownVisible(false); // Hide dropdown after delay
    }, 200); // Delay before hiding the dropdown

    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="relative w-full bg-gray-50 shadow-md font-sans">
      <nav className="flex flex-wrap justify-between sm:space-x-8 px-6 py-4 text-gray-800 font-semibold">
        {categories.map((category, index) => (
          <div
            key={index}
            ref={(el) => (categoryRefs.current[index] = el)}
            className="relative group sm:mr-4 mb-4 sm:mb-0 w-full sm:w-auto"
            onMouseEnter={() => handleMouseEnterCategory(category.name, index)}
            onMouseLeave={handleMouseLeaveCategory}
          >
            <button className="w-full sm:w-auto text-left text-gray-600 hover:text-black transition">
              {category.name}
            </button>

            {/* Category Dropdown */}
            {dropdownVisible && activeCategory === category.name && (
              <div
                className={`absolute top-full mt-4 w-44 bg-white border rounded-md shadow-lg z-10 ${dropdownPosition}`}
                onMouseEnter={handleMouseEnterDropdown}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <ul className="py-2 text-sm text-gray-700">
                  {category.subcategories.map((sub, subIndex) => (
                    <li
                      key={subIndex}
                      className="relative"
                      onMouseEnter={() => setActiveSubcategory(sub.name)}
                    >
                      <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                        {sub.name}
                      </button>

                      
                        {activeSubcategory === sub.name && sub.items.length > 0 && (
                        <div
                          className={`absolute top-0 mt-0 w-44 bg-white border rounded-md shadow-lg z-10 ${
                            dropdownPosition === "right-0" ? "right-full mr-0" : "left-full ml-0"
                          }`}
                        >
                          <ul className="py-2 text-md text-gray-700 text-left">
                                {sub.items.map((item, itemIndex) => (  
                                     <li key={itemIndex} className="pl-2"> {/* Ensures list items start from the left */}
                                    <button
                                      onClick={() => setCategoryFilter(item)}
                                      className="block w-full text-left px-2 py-2 hover:bg-gray-100"
                                    >
                                       {item}
                                    </button>
                                  </li>
                                ))}
                          </ul>

                        </div>
                      )}
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