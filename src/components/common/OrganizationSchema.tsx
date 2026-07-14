export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hareera",
    url: "https://www.ataa-aqiqa.com",
    logo: "https://www.ataa-aqiqa.com/images/logo.svg",
    description:
      "Hareera تنفذ ذبائح الأضحية والعقيقة والصدقة بأسعار مناسبة داخل مصر وفي أفريقيا للمسلمين.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Arabic",
    },
    sameAs: ["https://www.facebook.com/ataaaqiqa"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
