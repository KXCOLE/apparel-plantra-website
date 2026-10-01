"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";

type CartItem = Product & { size: string; quantity: number };
type CartContextValue = { items: CartItem[]; isOpen: boolean; addItem: (product: Product, size: string) => void; removeItem: (slug: string, size: string) => void; setOpen: (value: boolean) => void };
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [isOpen, setOpen] = useState(false); const [isReady, setIsReady] = useState(false);
  useEffect(() => { try { const saved = window.localStorage.getItem("apparel-plantra-cart"); if (saved) { const parsed = JSON.parse(saved); if (Array.isArray(parsed)) setItems(parsed); } } catch {} finally { setIsReady(true); } }, []);
  useEffect(() => { if (!isReady) return; try { window.localStorage.setItem("apparel-plantra-cart", JSON.stringify(items)); } catch {} }, [items, isReady]);
  const addItem = (product: Product, size: string) => { setItems(current => { const item = current.find(x => x.slug === product.slug && x.size === size); return item ? current.map(x => x === item ? { ...x, quantity: x.quantity + 1 } : x) : [...current, { ...product, size, quantity: 1 }]; }); setOpen(true); };
  const removeItem = (slug: string, size: string) => setItems(current => current.filter(x => !(x.slug === slug && x.size === size)));
  return <CartContext.Provider value={{ items, isOpen, addItem, removeItem, setOpen }}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used inside CartProvider"); return context; }
