import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://hareera.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productUrls: MetadataRoute.Sitemap = [];

  // Never let a missing/unavailable DB break the production build.
  try {
    const products = await prisma.product.findMany({
      select: { slug: true, id: true, updatedAt: true },
    });

    productUrls = products.map((p) => ({
      url: `${BASE_URL}/product/${encodeURIComponent(p.slug ?? p.id)}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    productUrls = [];
  }

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    ...productUrls,
  ];
}
