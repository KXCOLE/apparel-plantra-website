"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { products } from "@/data/products";
import { useCart } from "./cart-provider";
import { useCurrency } from "./currency-provider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();
  const { items, setOpen: setCartOpen } = useCart();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const matches = query.trim() ? products.filter(product => `${product.name} ${product.category} ${product.collection}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [];
  const closeMenu = () => setOpen(false);
  const closeSearch = () => { setSearchOpen(false); setQuery(""); };
  return <header className="site-header"><Link className="wordmark" href="/"><img src="/images/apparel-plantra-logo.png" alt="Apparel Plantra" /></Link><nav className="desktop-nav"><Link href="/#new">New arrivals</Link><Link href="/collections">Collections</Link><Link href="/#story">Our story</Link><a href="https://wa.me/27744993097?text=Hi%20Apparel%20Plantra%2C%20I%20would%20like%20to%20place%20an%20order." target="_blank">WhatsApp</a></nav><AnimatePresence>{open && <motion.nav className="mobile-nav" initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={reduced ? undefined : { clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}><Link href="/#new" onClick={closeMenu}>New arrivals</Link><Link href="/collections" onClick={closeMenu}>Collections</Link><Link href="/#story" onClick={closeMenu}>Our story</Link><a href="https://wa.me/27744993097?text=Hi%20Apparel%20Plantra%2C%20I%20would%20like%20to%20place%20an%20order." target="_blank" onClick={closeMenu}>WhatsApp</a></motion.nav>}</AnimatePresence><div className="header-actions"><select className="currency-select" value={currency} onChange={event => setCurrency(event.target.value as typeof currency)} aria-label="Display currency"><option value="ZAR">ZAR</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option></select><button className="search-button" onClick={() => setSearchOpen(true)} aria-label="Search products">Search</button><button className="bag-button" onClick={() => setCartOpen(true)}>Bag <sup>{String(count).padStart(2, "0")}</sup></button><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}><i/><i/></button></div><AnimatePresence>{searchOpen && <motion.section className="search-panel" role="dialog" aria-modal="true" aria-label="Search products" initial={reduced ? false : { y: "-100%" }} animate={{ y: 0 }} exit={reduced ? undefined : { y: "-100%" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}><div className="search-panel-head"><p className="eyebrow">Search the collection</p><button className="icon-button" onClick={closeSearch} aria-label="Close search">×</button></div><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Find me" aria-label="Find products" />{query.trim() ? <div className="search-results">{matches.length ? matches.map(product => <Link href={`/products/${product.slug}`} key={product.slug} onClick={closeSearch}><img src={product.image} alt=""/><span><strong>{product.name}</strong><small>{product.category} · {formatPrice(product.price)}</small></span><b>→</b></Link>) : <p>No pieces found.</p>}</div> : <p className="search-prompt">Search by product, collection or category.</p>}</motion.section>}</AnimatePresence></header>;
}
