"use client";

import Image from "next/image";
import { data } from "../../data";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useCartStore } from "../../stores/cartstore";
import { toast } from "sonner";

export default function ProductPage() {
  const params = useParams();
  const id = parseInt(params.id!, 10);
  const product = data.find((item) => item.id === id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("01");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-2">No product with ID {id} exists.</p>
        <Link href="/#section-2" className="text-blue-500 mt-4 inline-block">
          Back
        </Link>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setIsDropdownOpen(false);
  };

  const handleAddToCart = () => {
    // ✅ Convert price safely (handles strings like "£7,200.00")
    const numericPrice =
      typeof product.price === "number"
        ? product.price
        : Number(String(product.price).replace(/[^0-9.-]+/g, ""));

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: numericPrice,
      images: product.images,
      quantity: 1,
      size: selectedSize,
    };

    console.log("Product to add:", itemToAdd);
    console.log("Before add:", useCartStore.getState().items);

    addToCart(itemToAdd);

    console.log("✅ Added to cart:", itemToAdd);
    console.log("🛒 Cart now contains:", useCartStore.getState().items);

    toast(`${product.name} added to cart`);
  };

  return (
    <section className="bg-white min-h-screen text-black relative">
      {/* Back button */}
      <Link
        href="/#section-2"
        className="absolute top-12 ml-5 left-4 text-black z-20"
      >
        ←
      </Link>

      <div className="flex flex-col lg:flex-row">
        {/* LEFT: Mobile Slider */}
        <div className="w-full lg:hidden relative">
          <div className="relative w-full h-[85vh]">
            <Image
              src={product.images[currentIndex]}
              alt={`${product.name} ${currentIndex + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Arrows */}
          <button
            onClick={prevImage}
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* LEFT: Desktop Scroll */}
        <div className="hidden lg:block w-1/2">
          {product.images?.map((img: string, index: number) => (
            <div key={index} className="relative h-screen w-full">
              <Image
                src={img}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* RIGHT: Sticky Product Info */}
        <div className="w-full lg:w-[650px] lg:sticky lg:top-0 h-fit mt-12">
          <div className="w-full max-w-sm mx-auto py-10">
            {/* Header */}
            <div className="flex justify-between mb-4">
              <div className="text-xs flex items-center font-extralight text-gray-500">
                1AINTG
              </div>
              <CiHeart size={30} />
            </div>

            {/* Product Info */}
            <p className="text-sm mb-2 font-extralight text-gray-700">
              Fashion show
            </p>
            <h1 className="font-light mb-1 text-2xl">{product.name}</h1>
            <p className="text-gray-600 text-sm mb-5">£{product.price}</p>

            <div className="flex justify-between -mb-1.5">
              <div className="text-sm font-mono">Colors</div>
              <div>Grey</div>
            </div>

            {/* Thumbnails */}
            <div className="flex justify-start gap-3 mt-4">
              {product.images.slice(0, 5).map((img: string, index: number) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 rounded-md border cursor-pointer overflow-hidden ${
                    index === currentIndex ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <hr className="mt-4.5 text-gray-400" />

            {/* Size Dropdown */}
            <div className="relative mt-3">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleDropdown}
              >
                <div className="text-sm font-mono">Size</div>
                <div className="flex items-center gap-1">
                  {selectedSize}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-full bg-white border rounded-md shadow-lg z-20 max-h-36 overflow-y-auto">
                  {Array.from({ length: 10 }, (_, i) => {
                    const size = String(i + 1).padStart(2, "0");
                    return (
                      <div
                        key={size}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <hr className="mt-3 text-slate-200" />

            {/* Add to Cart */}
            <button
            onClick={() => {
  const numericPrice =
    typeof product.price === "number"
      ? product.price
      : Number(String(product.price).replace(/[^0-9.-]+/g, ""));

  const item = {
    id: product.id,
    name: product.name,
    price: numericPrice,
    images: product.images,
    size: selectedSize,
    quantity: 1,
  };

  addToCart(item);
  console.log("🧠 Store items:", useCartStore.getState().items);

  toast.success(`${product.name} added to cart`);
}}


              className="bg-black text-white px-6 mt-3.5 py-3 w-full rounded-4xl"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
