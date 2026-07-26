import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — Portfolio`,
    short_name: "Ahmadian",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#0891b2",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
