export type Product = { slug: string; name: string; price: number; category: string; collection: string; description: string; image: string; colors: string[]; sizes: string[]; badge?: string };

export const products: Product[] = [
  { slug: "ghost-tee", name: "GHOST TEE", price: 500, category: "T-Shirt", collection: "Aptra Graphics", description: "Graphic tee from the Apparel Plantra collection.", image: "/images/ghost-tee.png", colors: ["Black"], sizes: ["S", "M", "L", "XL"], badge: "New drop" },
  { slug: "hands-tee", name: "HANDS TEE", price: 500, category: "T-Shirt", collection: "Aptra Graphics", description: "Graphic tee from the Apparel Plantra collection.", image: "/images/hands-tee.png", colors: ["Black"], sizes: ["S", "M", "L", "XL"], badge: "New drop" },
  { slug: "knt-tee", name: "KNT TEE", price: 500, category: "T-Shirt", collection: "Aptra Graphics", description: "Graphic tee from the Apparel Plantra collection.", image: "/images/knt-tee.png", colors: ["Black"], sizes: ["S", "M", "L", "XL"], badge: "New drop" },
  { slug: "smoke-tee", name: "SMOKE TEE", price: 500, category: "T-Shirt", collection: "Aptra Graphics", description: "Graphic tee from the Apparel Plantra collection.", image: "/images/smoke-tee.png", colors: ["Black"], sizes: ["S", "M", "L", "XL"], badge: "New drop" },
  { slug: "ushuni-obizzayo-tee", name: "USHUNI OBIZZAYO TEE", price: 500, category: "T-Shirt", collection: "Aptra Graphics", description: "Graphic tee from the Apparel Plantra collection.", image: "/images/ushuni-obizzayo-tee.png", colors: ["Black"], sizes: ["S", "M", "L", "XL"], badge: "New drop" },
  { slug: "aptra-no-8-hoodie", name: "H HOODIE", price: 600, category: "Hoodie", collection: "Hoodies", description: "Black hoodie with a tonal Apparel Plantra chest wordmark.", image: "/images/aptra-no-8-hoodie.png", colors: ["Black"], sizes: ["S", "M", "L", "XL"], badge: "New drop" },
  { slug: "aptra-no-9-hoodie", name: "ASCENSION", price: 600, category: "Hoodie", collection: "Hoodies", description: "Black hoodie with an all-over tonal graphic and chest emblem.", image: "/images/aptra-no-9-hoodie.png", colors: ["Black"], sizes: ["S", "M", "L", "XL"], badge: "New drop" }
];

export const formatPrice = (price: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(price);
