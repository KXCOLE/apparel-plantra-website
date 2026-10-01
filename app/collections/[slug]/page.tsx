import Link from "next/link";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/cart-drawer";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { collections } from "@/data/collections";
import { products } from "@/data/products";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = collections.find(item => item.slug === slug);
  if (!collection) notFound();
  const collectionProducts = products.filter(product => product.collection.toLowerCase().replaceAll(" ", "-") === collection.slug);
  return <main><SiteHeader/><CartDrawer/><section className="collection-page section"><Link href="/collections" className="back">← All collections</Link><p className="eyebrow">{collection.status}</p><h1>{collection.name}</h1><p className="collection-description">{collection.description}</p>{collectionProducts.length ? <div className="product-grid">{collectionProducts.map(product => <ProductCard product={product} key={product.slug}/>)}</div> : <div className="collection-empty"><p>New pieces are on the way.</p><Link href="/collections" className="button solid">Explore collections</Link></div>}</section></main>;
}
