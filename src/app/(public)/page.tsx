import type { Metadata } from "next";
import Home from "@/features/home/components";
import { OrganizationSchema } from "@/components/common/OrganizationSchema";

export const metadata: Metadata = {
  title: "Hareera حريرة | ملابس نوم وبيتي حريمي - بيجامات وأطقم ساتان",
  description:
    "حريرة متجر ملابس نوم وبيتي حريمي: بيجامات، أطقم نوم ساتان، روبات، وقمصان نوم. راحتك وأناقتك أولويتنا. الدفع عند الاستلام وشحن لكل محافظات مصر مع استبدال خلال 14 يوم.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL ?? "https://hareera.vercel.app",
  },
};

export default function page() {
  return (
    <>
      <OrganizationSchema />
      <Home />
    </>
  );
}
