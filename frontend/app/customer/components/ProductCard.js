import Link from "next/link";

const ProductCard = ({ product }) => {
  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "https://via.placeholder.com/250?text=No+Image";

  return (
    <div 
      className="border p-4 rounded-lg shadow-md flex flex-col h-[370px] w-full transition transform hover:scale-105 hover:z-10" // ✅ Increased height
    >
      <Link href={`/customer/product/${product.id}`} passHref>
        
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-md">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-md  "
            onError={(e) => (e.target.src = "https://via.placeholder.com/250?text=No+Image")}
          />
        </div>
      </Link>

      <div className="flex flex-col flex-grow text-center mt-1"> 
  
      <h2 className="text-lg font-medium h-10 overflow-hidden">{product.name}</h2>  


      <p className=" text-md">{product.brand}</p>

  
      <p className="text-xl font-bold mt-1">₹{product.price}</p>  

 
      <Link href={`/customer/product/${product.id}`}>
      <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-black transition">
          View
      </button>
      </Link>
      </div>

    </div>
  );
};

export default ProductCard;
