"use client";

import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/components/cart-provider";
import { useCurrency } from "@/components/currency-provider";

type DeliveryDetails = { name: string; phone: string; address: string; suburb: string; city: string; postalCode: string };
const initialDelivery: DeliveryDetails = { name: "", phone: "", address: "", suburb: "", city: "", postalCode: "" };

export default function CartPage() {
  const { items, removeItem } = useCart();
  const { currency, formatPrice } = useCurrency();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [delivery, setDelivery] = useState<DeliveryDetails>(initialDelivery);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 2000 ? 0 : 110;
  const total = subtotal + deliveryFee;

  const updateDelivery = (field: keyof DeliveryDetails, value: string) => setDelivery(current => ({ ...current, [field]: value }));
  const checkout = async () => {
    setIsCheckingOut(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: items.map(item => ({ slug: item.slug, size: item.size, quantity: item.quantity })), delivery }) });
      const data = await response.json().catch(() => null) as { redirectUrl?: string; error?: string } | null;
      if (!response.ok || !data?.redirectUrl) throw new Error(data?.error || "Secure checkout is temporarily unavailable. Please try again shortly or contact us on WhatsApp.");
      window.location.assign(data.redirectUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Secure checkout is temporarily unavailable. Please try again shortly or contact us on WhatsApp.");
      setIsCheckingOut(false);
    }
  };

  return <main><SiteHeader/><section className="cart-page section"><p className="eyebrow">Bag / {items.length} items</p><h1>YOUR<br/>SELECTION.</h1>{items.length ? <div className="checkout-layout"><div>{items.map(item => <article className="bag-line" key={`${item.slug}-${item.size}`}><img src={item.image} alt=""/><div><strong>{item.name}</strong><small>Colour: {item.colors[0]} · Size: {item.size}</small><button className="text-button" onClick={() => removeItem(item.slug, item.size)}>Remove</button></div><strong>{formatPrice(item.price * item.quantity)}</strong></article>)}<section className="delivery-form" aria-labelledby="delivery-title"><p className="eyebrow">Delivery details</p><h2 id="delivery-title">WHERE SHOULD<br/>WE SEND IT?</h2><p>Delivery is R110 and takes a minimum of 7 days. Orders of R2,000 or more qualify for free delivery.</p><div className="delivery-fields"><label>Full name<input value={delivery.name} onChange={event => updateDelivery("name", event.target.value)} autoComplete="name" required /></label><label>Phone number<input value={delivery.phone} onChange={event => updateDelivery("phone", event.target.value)} autoComplete="tel" inputMode="tel" required /></label><label className="delivery-field-full">Street address<input value={delivery.address} onChange={event => updateDelivery("address", event.target.value)} autoComplete="street-address" required /></label><label>Suburb<input value={delivery.suburb} onChange={event => updateDelivery("suburb", event.target.value)} autoComplete="address-level3" required /></label><label>City<input value={delivery.city} onChange={event => updateDelivery("city", event.target.value)} autoComplete="address-level2" required /></label><label>Postal code<input value={delivery.postalCode} onChange={event => updateDelivery("postalCode", event.target.value)} autoComplete="postal-code" inputMode="numeric" required /></label></div></section></div><aside className="order-summary"><p>Subtotal <strong>{formatPrice(subtotal)}</strong></p><p>Delivery <strong>{deliveryFee ? formatPrice(deliveryFee) : "Free"}</strong></p><hr/><p className="total">Total <strong>{formatPrice(total)}</strong></p><button className="button solid" onClick={checkout} disabled={isCheckingOut}>{isCheckingOut ? "Redirecting to Yoco…" : "Continue to secure payment"}</button>{error ? <p className="checkout-error" role="alert">{error} <a href="https://wa.me/27744993097?text=Hi%20Apparel%20Plantra%2C%20I%20need%20help%20with%20my%20checkout." target="_blank" rel="noopener noreferrer">Message us</a></p> : <small>{currency === "ZAR" ? "Secure checkout powered by Yoco. Delivery takes a minimum of 7 days." : "Displayed conversion is estimated. Checkout is charged in ZAR."}</small>}</aside></div> : <div className="empty-page"><p>No pieces selected yet.</p><Link className="button solid" href="/#new">Shop the collection</Link></div>}</section></main>;
}
