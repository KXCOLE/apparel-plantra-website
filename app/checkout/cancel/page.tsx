import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function CheckoutCancelPage() {
  return <main><SiteHeader/><section className="checkout-result section"><p className="eyebrow">Checkout not completed</p><h1>YOUR BAG<br/>IS WAITING.</h1><p>No payment has been taken. You can return to your bag whenever you are ready.</p><Link className="button solid" href="/cart">Return to bag</Link></section></main>;
}
