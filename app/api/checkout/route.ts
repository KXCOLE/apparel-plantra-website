import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isReleased, products } from "@/data/products";
import { siteUrl } from "@/data/site";

type CheckoutItem = { slug?: unknown; size?: unknown; quantity?: unknown };
type DeliveryDetails = { name?: unknown; phone?: unknown; address?: unknown; suburb?: unknown; city?: unknown; postalCode?: unknown };
type Fulfilment = "delivery" | "handover";
const deliveryFee = 11000;
const freeDeliveryThreshold = 200000;
export const runtime = "nodejs";

const deliveryValue = (delivery: DeliveryDetails | undefined, field: keyof DeliveryDetails, maxLength: number) => {
  const value = delivery?.[field];
  return typeof value === "string" && value.trim().length > 1 && value.trim().length <= maxLength ? value.trim() : null;
};

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).origin !== siteUrl) return NextResponse.json({ error: "Invalid checkout request." }, { status: 403 });
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (!Number.isFinite(contentLength) || contentLength > 10_000) return NextResponse.json({ error: "Invalid checkout request." }, { status: 413 });
    const secretKey = process.env.YOCO_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Checkout is temporarily unavailable. Please try again shortly." }, { status: 503 });

    const body = await request.json().catch(() => null) as { items?: CheckoutItem[]; delivery?: DeliveryDetails; fulfilment?: Fulfilment } | null;
    if (!body?.items?.length || !Array.isArray(body.items)) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    const recipient = deliveryValue(body.delivery, "name", 100);
    const phone = deliveryValue(body.delivery, "phone", 30);
    const address = deliveryValue(body.delivery, "address", 160);
    const suburb = deliveryValue(body.delivery, "suburb", 80);
    const city = deliveryValue(body.delivery, "city", 80);
    const postalCode = deliveryValue(body.delivery, "postalCode", 12);
    if (!recipient || !phone || !address || !suburb || !city || !postalCode) return NextResponse.json({ error: "Please complete your delivery details before checkout." }, { status: 400 });
    const fulfilment = body.fulfilment === "handover" ? "handover" : "delivery";
    if (fulfilment === "handover" && suburb.toLowerCase() !== "braamfontein") return NextResponse.json({ error: "Free local handover is available only in Braamfontein." }, { status: 400 });
    const items = body.items.map(item => {
      const product = typeof item.slug === "string" ? products.find(entry => entry.slug === item.slug) : undefined;
      const quantity = typeof item.quantity === "number" && Number.isInteger(item.quantity) ? item.quantity : 0;
      const size = typeof item.size === "string" ? item.size : "";
      if (!product || product.soldOut || !isReleased(product) || !product.sizes.includes(size) || quantity < 1 || quantity > 10) return null;
      return { product, quantity, size };
    });
    if (items.some(item => !item)) return NextResponse.json({ error: "One or more bag items are unavailable." }, { status: 400 });

    const validItems = items as { product: (typeof products)[number]; quantity: number; size: string }[];
    const orderReference = randomUUID();
    const subtotal = validItems.reduce((total, item) => total + item.product.price * item.quantity * 100, 0);
    const shipping = fulfilment === "handover" || subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", "Idempotency-Key": orderReference },
      body: JSON.stringify({ amount: subtotal + shipping, currency: "ZAR", successUrl: `${siteUrl}/checkout/success?order=${orderReference}`, cancelUrl: `${siteUrl}/checkout/cancel?order=${orderReference}`, failureUrl: `${siteUrl}/checkout/cancel?order=${orderReference}`, metadata: { orderReference, items: validItems.map(item => `${item.product.slug}:${item.size}:${item.quantity}`).join(","), delivery: `${recipient}; ${phone}; ${address}; ${suburb}; ${city}; ${postalCode}`, fulfilment, deliveryFee: String(shipping / 100) } }),
      cache: "no-store"
    });
    const responseBody = await response.text();
    const checkout = (() => { try { return JSON.parse(responseBody || "null") as { redirectUrl?: string } | null; } catch { return null; } })();
    if (!response.ok || !checkout?.redirectUrl) { console.error("Yoco checkout rejected", { status: response.status, response: responseBody }); return NextResponse.json({ error: "Checkout is temporarily unavailable. Please try again shortly." }, { status: 502 }); }
    return NextResponse.json({ redirectUrl: checkout.redirectUrl });
  } catch (error) {
    console.error("Yoco checkout error", error);
    return NextResponse.json({ error: "Checkout is temporarily unavailable. Please try again shortly." }, { status: 500 });
  }
}
