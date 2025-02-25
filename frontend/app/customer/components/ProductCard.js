"use client";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }) => {
  const router = useRouter();

  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "https://via.placeholder.com/250?text=No+Image";

  const handleNavigation = () => {
    router.push(`/customer/product/${product.id}`);
  };

  return (
    <div
      className="border p-4 rounded-lg shadow-md flex flex-col h-[330px] w-full transition-transform transform hover:scale-105 hover:z-10 bg-slate-100 cursor-pointer"
      onClick={handleNavigation}
    >
      <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
        <img
          src={imageUrl}
          alt={`Image of ${product.name}`}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => (e.target.src = "https://via.placeholder.com/250?text=No+Image")}
        />
      </div>

      <div className="flex flex-col flex-grow text-center mt-2">
        <h2 className="text-lg font-medium h-10 overflow-hidden text-ellipsis whitespace-nowrap">
          {product.name}
        </h2>
        <p className="text-md text-gray-600">{product.brand}</p>
        <p className="text-xl font-bold mt-1 text-gray-800">₹{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
