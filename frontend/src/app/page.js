// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ShoppingCart, Store } from "lucide-react"; // Icons for better UI

// export default function Home() {
//   const router = useRouter();

//   const handleVendorDashboard = () => {
//     console.log("Navigating to Mainpage...");
//     router.push("/Mainpage"); // Navigate to the correct path
//   };

//   return (
//     <div>
//       {/* Hero Section with Background Image */}
//       <section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
//         style={{ }}> 
//         {/* Overlay for better readability */}
//         <div className="absolute inset-0 bg-black opacity-50"></div>

//         <div className="relative z-10 max-w-3xl text-white px-6">
//           <h1 className="text-5xl font-bold mb-4 animate-fade-in">Welcome to Our Marketplace</h1>
//           <p className="text-lg text-gray-300 mb-6 animate-fade-in">Buy & Sell with ease. Discover amazing products or start selling today!</p>

//           <div className="flex justify-center space-x-4">
//             <Link href="/customer/products">
//               <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-black transition shadow-md animate-bounce">
//                 <ShoppingCart size={20} /> Explore Products
//               </button>
//             </Link>
//             <button
//               onClick={handleVendorDashboard}
//               className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-black transition shadow-md animate-bounce"
//             >
//               <Store size={20} /> Vendor Dashboard
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Vendor Call-to-Action Section */}
//       <section className="bg-white text-center py-16">
//         <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Selling Today!</h2>
//         <p className="text-lg text-gray-600 mb-6">Join our marketplace and reach thousands of customers.</p>
//         <button
//           onClick={handleVendorDashboard}
//           className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition shadow-md"
//         >
//           Become a Vendor
//         </button>
//       </section>
//     </div>
//   );
// }


"use client";
import Homepage from "./Home/page.js";
export default function Home() {
  return (
    <Homepage/>
  );
}