import { Metadata } from "next";
import { CartContent } from "@/features/cart/CartContent";

export const metadata: Metadata = {
  title: "عربة التسوق | Hareera",
  description: "راجعي مشترياتك وأكملي الطلب بالدفع عند الاستلام.",
};

export default function CartPage() {
  return <CartContent />;
}
