import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function CheckoutSuccessPage() {
  return <main><SiteHeader/><section className="checkout-result section"><p className="eyebrow">Payment received</p><h1>THANK<br/>YOU.</h1><p>We have received your payment return and will confirm your order shortly.</p><Link className="button solid" href="/">Continue shopping</Link></section></main>;
}
