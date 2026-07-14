import { ContactButtons } from "./ContactButtons";
import { FooterSocial } from "./FooterSocial";

export const FooterContact = () => {
  return (
    <div className="mt-4">
      <p className="text-regular-normal md:text-regular-medium mb-4">
        Hareera — ملابس نوم وبيتي بخامات ناعمة وتصاميم أنيقة. راحتك وأناقتك أولويتنا.
      </p>

      <ContactButtons />

      <FooterSocial />
    </div>
  );
};