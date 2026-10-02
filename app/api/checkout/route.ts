import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { siteUrl } from "@/data/site";

type CheckoutItem = { slug?: unknown; size?: unknown; quantity?: unknown };
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).origin !== siteUrl) return NextResponse.json({ error: "Invalid checkout request." }, { status: 403 });
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (!Number.isFinite(contentLength) || contentLength > 10_000) return NextResponse.json({ error: "Invalid checkout request." }, { status: 413 });
    const secretKey = process.env.YOCO_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Checkout is temporarily unavailable. Please try again shortly." }, { status: 503 });

    const body = await request.json().catch(() => null) as { items?: CheckoutItem[] } | null;
    if (!body?.items?.length || !Array.isArray(body.items)) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
    const items = body.items.map(item => {
      const product = typeof item.slug === "string" ? products.find(entry => entry.slug === item.slug) : undefined;
      const quantity = typeof item.quantity === "number" && Number.isInteger(item.quantity) ? item.quantity : 0;
      const size = typeof item.size === "string" ? item.size : "";
      if (!product || !product.sizes.includes(size) || quantity < 1 || quantity > 10) return null;
      return { product, quantity, size };
    });
    if (items.some(item => !item)) return NextResponse.json({ error: "One or more bag items are unavailable." }, { status: 400 });

    const validItems = items as { product: (typeof products)[number]; quantity: number; size: string }[];
    const orderReference = randomUUID();
    const amount = validItems.reduce((total, item) => total + item.product.price * item.quantity * 100, 0);
    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", "Idempotency-Key": orderReference },
      body: JSON.stringify({ amount, currency: "ZAR", successUrl: `${siteUrl}/checkout/success?order=${orderReference}`, cancelUrl: `${siteUrl}/checkout/cancel?order=${orderReference}`, failureUrl: `${siteUrl}/checkout/cancel?order=${orderReference}`, metadata: { orderReference, items: validItems.map(item => `${item.product.slug}:${item.size}:${item.quantity}`).join(",") } }),
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
