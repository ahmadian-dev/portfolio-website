import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/projects";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: SITE.name,
        jobTitle: SITE.title,
        email: SITE.email,
        url: SITE.url,
        sameAs: [SITE.github],
        address: { "@type": "PostalAddress", addressCountry: "TR" },
        telephone: SITE.phone,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: `${SITE.name} Portfolio`,
        description: SITE.description,
        publisher: { "@id": `${SITE.url}/#person` },
      },
      ...PROJECTS.map((p) => ({
        "@type": "SoftwareApplication",
        name: p.name,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: `${SITE.url}/projects/${p.slug}`,
        description: p.subtitle,
        author: { "@id": `${SITE.url}/#person` },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      })),
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
