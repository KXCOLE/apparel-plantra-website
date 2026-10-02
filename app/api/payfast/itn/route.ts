import { createHash, timingSafeEqual } from "crypto";

const encodeValue = (value: string) => encodeURIComponent(value.trim()).replace(/%20/g, "+");
const createSignature = (data: Record<string, string>, passphrase: string) => createHash("md5").update(`${Object.entries(data).filter(([, value]) => value).map(([key, value]) => `${key}=${encodeValue(value)}`).join("&")}&passphrase=${encodeValue(passphrase)}`).digest("hex");

export async function POST(request: Request) {
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  if (!passphrase) return new Response("PayFast is not configured.", { status: 503 });
  const form = await request.formData();
  const payload = Object.fromEntries([...form.entries()].map(([key, value]) => [key, String(value)]));
  const receivedSignature = payload.signature;
  delete payload.signature;
  const expectedSignature = createSignature(payload, passphrase);
  const validSignature = Boolean(receivedSignature) && receivedSignature.length === expectedSignature.length && timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature));
  if (!validSignature) return new Response("Invalid payment notification.", { status: 400 });
  return new Response("OK", { status: 200 });
}
