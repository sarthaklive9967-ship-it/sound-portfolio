import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(origin ? { sitemap: new URL("/sitemap.xml", origin).href } : {}),
  };
}
