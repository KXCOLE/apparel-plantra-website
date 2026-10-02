import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { siteUrl } from "@/data/site";

type CheckoutItem = { slug?: unknown; size?: unknown; quantity?: unknown };
export const runtime = "nodejs";

const encodeValue = (value: string) => encodeURIComponent(value.trim()).replace(/%20/g, "+");
const createSignature = (data: Record<string, string>, passphrase: string) => createHash("md5").update(`${Object.entries(data).filter(([, value]) => value).map(([key, value]) => `${key}=${encodeValue(value)}`).join("&")}&passphrase=${encodeValue(passphrase)}`).digest("hex");

export async function POST(request: Request) {
  try {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).origin !== siteUrl) return NextResponse.json({ error: "Invalid checkout request." }, { status: 403 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (!Number.isFinite(contentLength) || contentLength > 10_000) return NextResponse.json({ error: "Invalid checkout request." }, { status: 413 });
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  if (!merchantId || !merchantKey || !passphrase) return NextResponse.json({ error: "PayFast is not configured yet." }, { status: 503 });

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
  const amount = validItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  const fields: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${siteUrl}/checkout/success?order=${orderReference}`,
    cancel_url: `${siteUrl}/checkout/cancel?order=${orderReference}`,
    notify_url: `${siteUrl}/api/payfast/itn`,
    m_payment_id: orderReference,
    amount,
    item_name: `Apparel Plantra order ${orderReference.slice(0, 8)}`,
    item_description: validItems.map(item => `${item.product.name} (${item.size}) × ${item.quantity}`).join(", ")
  };
  fields.signature = createSignature(fields, passphrase);
  const action = process.env.PAYFAST_SANDBOX === "true" ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process";
  return NextResponse.json({ action, fields });
  } catch (error) {
    console.error("PayFast checkout setup error", error);
    return NextResponse.json({ error: "Checkout could not start. Confirm the PayFast settings and redeploy." }, { status: 500 });
  }
}
