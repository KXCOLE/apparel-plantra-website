"use client";
import { createContext, useContext, useState } from "react";
import type { Product } from "@/data/products";

type CartItem = Product & { size: string; quantity: number };
type CartContextValue = { items: CartItem[]; isOpen: boolean; addItem: (product: Product, size: string) => void; removeItem: (slug: string, size: string) => void; setOpen: (value: boolean) => void };
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [isOpen, setOpen] = useState(false);
  const addItem = (product: Product, size: string) => { setItems(current => { const item = current.find(x => x.slug === product.slug && x.size === size); return item ? current.map(x => x === item ? { ...x, quantity: x.quantity + 1 } : x) : [...current, { ...product, size, quantity: 1 }]; }); setOpen(true); };
  const removeItem = (slug: string, size: string) => setItems(current => current.filter(x => !(x.slug === slug && x.size === size)));
  return <CartContext.Provider value={{ items, isOpen, addItem, removeItem, setOpen }}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used inside CartProvider"); return context; }
