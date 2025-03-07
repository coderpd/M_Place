// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [customerId, setCustomerId] = useState(null);

//   // Load cart from localStorage based on customer ID
// useEffect(() => {
//   if (customerId) {
//     const storedCart = localStorage.getItem(`cart_${customerId}`);
//     if (storedCart) {
//       setCart(JSON.parse(storedCart));
//     }
//   }
// }, [customerId]);

// // Save cart to localStorage when cart changes
// useEffect(() => {
//   if (customerId) {
//     localStorage.setItem(`cart_${customerId}`, JSON.stringify(cart));
//   }
// }, [cart, customerId]);

  
//   // Fetch cart from backend when customerId changes
//   useEffect(() => {
//     if (!customerId) return;

//     const fetchCart = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/cart/${customerId}`);
//         const data = await response.json();
         
//         if (data.success) {
//           setCart(data.cartItems);
//         }
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       }
//     };

//     fetchCart();
//   }, [customerId]);

//   // Save cart to localStorage when cart changes
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   }, [cart]);

//   // Add product to cart
//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       const existingProduct = prevCart.find((item) => item.id === product.id);
//       if (existingProduct) {
//         return prevCart.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       } else {
//         return [...prevCart, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   // Remove product from cart
//   const removeFromCart = (productId) => {
//     setCart((prevCart) => {
//       const updatedCart = prevCart.filter((item) => item.id !== productId);
//       localStorage.setItem(`cart_${customerId}`, JSON.stringify(updatedCart));
//       return updatedCart;
//     });
//   };
  
//   const updateQuantity = (productId, action) => {
//     setCart((prevCart) => {
//       const updatedCart = prevCart.map((item) =>
//         item.id === productId
//           ? {
//               ...item,
//               quantity: action === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
//             }
//           : item
//       );
//       localStorage.setItem(`cart_${customerId}`, JSON.stringify(updatedCart));
//       return updatedCart;
//     });
//   };
  

//   return (
//     <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };



