"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { products, type Product } from "@/data/products";

type CartItem = Product & { size: string; quantity: number };
type CartContextValue = { items: CartItem[]; isOpen: boolean; addItem: (product: Product, size: string) => void; removeItem: (slug: string, size: string) => void; clearCart: () => void; setOpen: (value: boolean) => void };
const CartContext = createContext<CartContextValue | undefined>(undefined);
type SavedCartItem = { slug?: unknown; size?: unknown; quantity?: unknown };
const restoreCart = (value: unknown): CartItem[] => !Array.isArray(value) ? [] : value.flatMap(item => { if (!item || typeof item !== "object") return []; const saved = item as SavedCartItem; const product = typeof saved.slug === "string" ? products.find(entry => entry.slug === saved.slug) : undefined; const size = typeof saved.size === "string" ? saved.size : ""; const quantity = typeof saved.quantity === "number" && Number.isInteger(saved.quantity) ? saved.quantity : 0; return product && !product.soldOut && product.sizes.includes(size) && quantity > 0 && quantity <= 10 ? [{ ...product, size, quantity }] : []; });

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [isOpen, setOpen] = useState(false); const [isReady, setIsReady] = useState(false);
  useEffect(() => { try { const saved = window.localStorage.getItem("apparel-plantra-cart"); if (saved) setItems(restoreCart(JSON.parse(saved))); } catch {} finally { setIsReady(true); } }, []);
  useEffect(() => { if (!isReady) return; try { window.localStorage.setItem("apparel-plantra-cart", JSON.stringify(items)); } catch {} }, [items, isReady]);
  const addItem = (product: Product, size: string) => { if (product.soldOut) return; setItems(current => { const item = current.find(x => x.slug === product.slug && x.size === size); return item ? current.map(x => x === item ? { ...x, quantity: Math.min(x.quantity + 1, 10) } : x) : [...current, { ...product, size, quantity: 1 }]; }); setOpen(true); };
  const removeItem = (slug: string, size: string) => setItems(current => current.filter(x => !(x.slug === slug && x.size === size)));
  const clearCart = () => { setItems([]); setOpen(false); };
  return <CartContext.Provider value={{ items, isOpen, addItem, removeItem, clearCart, setOpen }}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("useCart must be used inside CartProvider"); return context; }
