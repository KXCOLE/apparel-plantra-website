"use client";

import Link from "next/link";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { type Product } from "@/data/products";
import { useCart } from "@/components/cart-provider";
import { useCurrency } from "@/components/currency-provider";

const fitAdvice = {
  "T-Shirt": "Relaxed everyday fit. Choose your usual size for the intended silhouette; choose one size up for a looser look.",
  Hoodie: "Relaxed, slightly oversized fit. Choose your usual size for the intended silhouette; choose one size down for a neater fit.",
  Shorts: "Relaxed fit with an elastic waist. Choose your usual size for the intended silhouette; choose one size up for extra room."
};

export function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const advice = fitAdvice[product.category as keyof typeof fitAdvice] ?? "Choose your usual size for the intended fit.";

  return <main><SiteHeader/><CartDrawer/><div className="product-page"><Link href="/#new" className="back">← Back to arrivals</Link><div className="product-detail"><div className="detail-image"><img src={product.image} alt={product.name}/></div><div className="detail-info"><p className="eyebrow">{product.category} / {product.badge ?? "Edition"}</p><h1>{product.name}</h1><h2>{formatPrice(product.price)}</h2><p className="description">{product.description}</p><fieldset><legend>Colour — {color}</legend><div className="choices">{product.colors.map(value => <button className={color === value ? "selected" : ""} onClick={() => setColor(value)} key={value}>{value}</button>)}</div></fieldset><fieldset><legend>Size</legend><div className="choices">{product.sizes.map(value => <button className={size === value ? "selected" : ""} onClick={() => setSize(value)} key={value}>{value}</button>)}</div><a className="size-guide" href="#fit">Find your fit ↓</a></fieldset><button className="button solid add" onClick={() => addItem(product, size)}>Add to bag — {formatPrice(product.price)}</button><div className="accordions"><details open><summary>Composition & care <span>+</span></summary><p>Designed for daily wear. Follow the garment-care label for the best long-term finish.</p></details><details><summary>Delivery & returns <span>+</span></summary><p>Delivery and returns will be calculated at checkout once they are available.</p></details></div></div></div><section id="fit" className="fit-guide"><p className="eyebrow">Find your fit</p><h2>MADE TO<br/>MOVE.</h2><div><p>{advice}</p><p className="fit-note">For a more precise recommendation, message us on WhatsApp with your usual size and height.</p><a className="button solid" href="https://wa.me/27744993097?text=Hi%20Apparel%20Plantra%2C%20I%20need%20help%20finding%20my%20fit." target="_blank">Get fit help</a></div></section></div></main>;
}
