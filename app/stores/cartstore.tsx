import { create } from "zustand";

type CartItem = {
  id: number;
  name: string;
  price: number;
  images: string[];
  size?: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, size?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loadFromLocalStorage: () => void;
};

// ✅ Key for storage
const CART_KEY = "cart_items";

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (item) => {
    const { items } = get();

    // Check if item exists
    const existing = items.find(
      (i) => i.id === item.id && i.size === item.size
    );

    let updatedItems;
    if (existing) {
      // Increment quantity
      updatedItems = items.map((i) =>
        i.id === item.id && i.size === item.size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      // Add new
      updatedItems = [...items, { ...item, quantity: 1 }];
    }

    // ✅ Save to localStorage
    localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
    set({ items: updatedItems });

    console.log("🧠 Cart updated:", updatedItems);
  },

  removeFromCart: (id, size) => {
    const filtered = get().items.filter(
      (i) => !(i.id === id && i.size === size)
    );
    localStorage.setItem(CART_KEY, JSON.stringify(filtered));
    set({ items: filtered });
  },

  clearCart: () => {
    localStorage.removeItem(CART_KEY);
    set({ items: [] });
  },

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),

  // ✅ Load from localStorage (you’ll call this once on app load)
  loadFromLocalStorage: () => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ items: parsed });
          console.log("🧠 Loaded cart from storage:", parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  },
}));
