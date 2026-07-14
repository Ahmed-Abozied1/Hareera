import { Metadata } from "next";
import { ShopContent } from "@/features/shop/ShopContent";

export const metadata: Metadata = {
  title: "المتجر | Hareera",
  description:
    "تسوّقي تشكيلة Hareera من البيجامات وأطقم النوم والروبات بخامات ناعمة وألوان أنيقة. الدفع عند الاستلام وشحن لكل المحافظات.",
};

export default function ShopPage() {
  return <ShopContent />;
}
