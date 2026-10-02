import { createHash, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

const encodeValue = (value: string) => encodeURIComponent(value.trim()).replace(/%20/g, "+");
const createSignature = (data: Record<string, string>, passphrase: string) => createHash("md5").update(`${Object.entries(data).filter(([, value]) => value).map(([key, value]) => `${key}=${encodeValue(value)}`).join("&")}&passphrase=${encodeValue(passphrase)}`).digest("hex");

export async function POST(request: Request) {
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  if (!passphrase || !merchantId) return new Response("Payment notifications are unavailable.", { status: 503 });
  const rawBody = await request.text();
  const payload = Object.fromEntries([...new URLSearchParams(rawBody).entries()]);
  const receivedSignature = payload.signature;
  delete payload.signature;
  const expectedSignature = createSignature(payload, passphrase);
  const validSignature = Boolean(receivedSignature) && receivedSignature.length === expectedSignature.length && timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature));
  if (!validSignature || payload.merchant_id !== merchantId) return new Response("Invalid payment notification.", { status: 400 });
  const host = process.env.PAYFAST_SANDBOX === "true" ? "https://sandbox.payfast.co.za" : "https://www.payfast.co.za";
  const confirmation = await fetch(`${host}/eng/query/validate`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: rawBody, cache: "no-store" }).catch(() => null);
  if (!confirmation || !confirmation.ok || (await confirmation.text()).trim() !== "VALID") return new Response("Payment notification could not be verified.", { status: 400 });
  return new Response("OK", { status: 200 });
}
