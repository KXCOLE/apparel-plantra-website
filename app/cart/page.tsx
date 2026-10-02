"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/components/cart-provider";
import { useCurrency } from "@/components/currency-provider";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const { currency, formatPrice } = useCurrency();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkout = async () => {
    setIsCheckingOut(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: items.map(item => ({ slug: item.slug, size: item.size, quantity: item.quantity })) }) });
      const data = await response.json().catch(() => null) as { redirectUrl?: string; error?: string } | null;
      if (!response.ok || !data?.redirectUrl) throw new Error("Secure checkout is temporarily unavailable. Please try again shortly or contact us on WhatsApp.");
      window.location.assign(data.redirectUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Secure checkout is temporarily unavailable. Please try again shortly or contact us on WhatsApp.");
      setIsCheckingOut(false);
    }
  };

  return <main><SiteHeader/><section className="cart-page section"><p className="eyebrow">Bag / {items.length} items</p><h1>YOUR<br/>SELECTION.</h1>{items.length ? <div className="checkout-layout"><div>{items.map(item => <article className="bag-line" key={`${item.slug}-${item.size}`}><img src={item.image} alt=""/><div><strong>{item.name}</strong><small>Colour: {item.colors[0]} · Size: {item.size}</small><button className="text-button" onClick={() => removeItem(item.slug, item.size)}>Remove</button></div><strong>{formatPrice(item.price * item.quantity)}</strong></article>)}</div><aside className="order-summary"><p>Subtotal <strong>{formatPrice(total)}</strong></p><p>Delivery <span>Calculated later</span></p><hr/><p className="total">Total <strong>{formatPrice(total)}</strong></p><button className="button solid" onClick={checkout} disabled={isCheckingOut}>{isCheckingOut ? "Redirecting to Yoco…" : "Pay securely with Yoco"}</button>{error ? <p className="checkout-error" role="alert">{error} <a href="https://wa.me/27744993097?text=Hi%20Apparel%20Plantra%2C%20I%20need%20help%20with%20my%20checkout." target="_blank">Message us</a></p> : <small>{currency === "ZAR" ? "Secure checkout powered by Yoco." : "Displayed conversion is estimated. Checkout is charged in ZAR."}</small>}</aside></div> : <div className="empty-page"><p>No pieces selected yet.</p><Link className="button solid" href="/#new">Shop the collection</Link></div>}</section></main>;
}
