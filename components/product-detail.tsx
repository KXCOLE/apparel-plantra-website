"use client";

import Link from "next/link";
import { useState } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice, type Product } from "@/data/products";
import { useCart } from "@/components/cart-provider";

export function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const { addItem } = useCart();
  return <main><SiteHeader/><CartDrawer/><div className="product-page"><Link href="/#new" className="back">← Back to arrivals</Link><div className="product-detail"><div className="detail-image"><img src={product.image} alt={product.name}/></div><div className="detail-info"><p className="eyebrow">{product.category} / {product.badge ?? "Edition"}</p><h1>{product.name}</h1><h2>{formatPrice(product.price)}</h2><p className="description">{product.description}</p><fieldset><legend>Colour — {color}</legend><div className="choices">{product.colors.map(value => <button className={color === value ? "selected" : ""} onClick={() => setColor(value)} key={value}>{value}</button>)}</div></fieldset><fieldset><legend>Size</legend><div className="choices">{product.sizes.map(value => <button className={size === value ? "selected" : ""} onClick={() => setSize(value)} key={value}>{value}</button>)}</div><a className="size-guide" href="#fit">Find your fit ↗</a></fieldset><button className="button solid add" onClick={() => addItem(product, size)}>Add to bag — {formatPrice(product.price)}</button><div className="accordions"><details open><summary>Composition & care <span>+</span></summary><p>Designed for daily wear. Follow the garment-care label for the best long-term finish.</p></details><details><summary>Delivery & returns <span>+</span></summary><p>Delivery and returns will be calculated at checkout once they are available.</p></details></div></div></div></div></main>;
}
