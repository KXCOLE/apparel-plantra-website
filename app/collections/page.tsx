import Link from "next/link";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { collections } from "@/data/collections";

export default function CollectionsPage() {
  return <main><SiteHeader/><CartDrawer/><section className="collection-index section"><p className="eyebrow">Shop by collection</p><h1>THE<br/>COLLECTIONS.</h1><div className="collection-list">{collections.filter(collection => !collection.parentSlug).map(collection => <Link href={`/collections/${collection.slug}`} className="collection-link" key={collection.slug}><span>{collection.name}</span><small>{collection.status}</small><b>→</b></Link>)}</div></section></main>;
}
