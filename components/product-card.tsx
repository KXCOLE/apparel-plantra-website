"use client";
import Link from "next/link";
import { Product } from "@/data/products";
import { StaggerItem } from "./motion";
import { useCurrency } from "./currency-provider";

export function ProductCard({ product }: { product: Product }) {
  const { formatPrice } = useCurrency();
  return <StaggerItem><Link className="product-card" href={`/products/${product.slug}`}><div className="product-image"><img src={product.image} alt={product.name}/>{product.badge && <span>{product.badge}</span>}<b>Discover</b></div><div className="product-copy"><div><strong>{product.name}</strong><small>{product.category}</small></div><strong>{formatPrice(product.price)}</strong></div></Link></StaggerItem>;
}
