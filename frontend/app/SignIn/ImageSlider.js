"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const images = [
  { src: "/lap.jpg", alt: "Laptop", title: "Modern Laptops", description: "Sleek, fast, and lightweight laptops for professionals." },
  { src: "/c-class.jpg", alt: "C-Class Items", title: "Essential Accessories", description: "Affordable IT accessories for everyday use." },
  { src: "/Server.jpg", alt: "Server", title: "Powerful Server Solutions", description: "High-performance servers designed for seamless data processing, reliability, and scalability for modern businesses." },
  { src: "/desktop.jpg", alt: "Desktop", title: "Powerful Desktops", description: "Explore high-performance desktops for work." },
  { src: "/keyboard.jpg", alt: "Keyboard", title: "Mechanical Keyboards", description: "Experience smooth and fast typing with our keyboards." },
  { src: "/printer.jpg", alt: "Printer", title: "Smart Printers", description: "Reliable and high-quality printing for every need." }
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        handleNext();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isHovered, index]);

  const handlePrev = () => {
    setIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div 
      className="w-1/2 h-screen fixed left-0 top-0 flex items-center justify-center bg-gray-900 text-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute w-full h-full"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: "linear" }}
          >
            <img 
              src={images[index].src} 
              alt={images[index].alt} 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-10 left-10 bg-black bg-opacity-60 p-6 rounded-lg max-w-md">
              <h3 className="text-3xl font-bold">{images[index].title}</h3>
              <p className="text-lg mt-2">{images[index].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft className="text-gray-800 w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors z-10"
        aria-label="Next image"
      >
        <ChevronRight className="text-gray-800 w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-gray-400'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}