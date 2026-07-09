"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customNotes?: string;
  restaurantId?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: any) => void;
  updateQuantity: (id: string, amount: number) => void; 
  clearCart: () => void; // 1. Added clearCart here so TypeScript knows it's shared
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const clearCart = () => setCart([]);

  const addToCart = (item: any) => {
    const itemId = item._id || item.id || item.menuItemId;
    const itemRestaurantId = item.restaurantId || item.restaurant?._id;

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === itemId);
      
      if (existingItem) {
        return prevCart.map((i) =>
          i._id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      // 2. Map properties cleanly so it explicitly builds an _id parameter
      return [
        ...prevCart, 
        {
          _id: itemId,
          name: item.name,
          price: item.price,
          image: item.image,
          customNotes: item.customNotes,
          restaurantId: itemRestaurantId,
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (id: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item._id === id ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0) 
    );
  };

  return (
    // 3. Exposing everything seamlessly down to layout.tsx children wrappers
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}