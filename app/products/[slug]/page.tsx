import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { products } from "@/data/products";
import { siteName, siteUrl } from "@/data/site";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  const title = `${product.name} | ${siteName}`;
  return { title, description: `${product.description} Available for R${product.price}.`, alternates: { canonical: `/products/${product.slug}` }, openGraph: { title, description: product.description, url: `/products/${product.slug}`, images: [{ url: product.image, alt: product.name }] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const structuredData = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: `${siteUrl}${product.image}`, brand: { "@type": "Brand", name: siteName }, offers: { "@type": "Offer", price: product.price, priceCurrency: "ZAR", url: `${siteUrl}/products/${product.slug}`, itemCondition: "https://schema.org/NewCondition" } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/><ProductDetail product={product}/></>;
}
