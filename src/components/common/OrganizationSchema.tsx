export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hareera",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://hareera.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://hareera.vercel.app"}/images/logo/hareera-logo.svg`,
    description:
      "حريرة متجر ملابس نوم وبيتي حريمي: بيجامات، أطقم نوم ساتان، روبات، وقمصان نوم. الدفع عند الاستلام وشحن لكل محافظات مصر مع استبدال خلال 14 يوم.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Arabic",
    },
    sameAs: [
      "https://www.facebook.com/Hareera.YM",
      "https://www.instagram.com/hareera.ym/",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
