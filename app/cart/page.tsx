"use client";

import { useCartStore } from "../stores/cartstore";

export default function CartPage() {
  // ✅ Match the actual key name in your Zustand store (usually "items")
  const items = useCartStore((state) => state.items);

  // ✅ Ensure items is always an array before using reduce
  const total = Array.isArray(items)
    ? items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 mt-14">Your Cart</h1>

      {(!items || items.length === 0) ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col justify-between  min-h-80 bg-green-500 border-b ">
              <div className="border-b flex">
                <img src={item.images[0]} alt="product image" className="h-40" />
                <p className="items-center flex text-center">{item.name}</p>
                
                
              </div>
              <div className="flex-col p-2 bg-pink-600">
                <div className="flex justify-between">
                    <div>Colour</div>
                    <div>Monogram Snowy Pearl</div>
                </div>
                <div className="flex justify-between">
                    <div>Materials</div>
                    <div>Monogram Canvas</div>
                </div>
                <div className="flex justify-between">
                    <div>input</div>
                    <div>$ {item.price}</div>
                </div>
                <div className="flex justify-between">
                    <div>1</div>
                    <div>2</div>
                </div>
               
              </div>
            </div>
          ))}

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold">Total: ${total}</p>
            <button className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
