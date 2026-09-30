import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import { siteUrl } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/collections`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/cart`, changeFrequency: "monthly", priority: 0.3 },
    ...collections.map((collection) => ({ url: `${siteUrl}/collections/${collection.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((product) => ({ url: `${siteUrl}/products/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
