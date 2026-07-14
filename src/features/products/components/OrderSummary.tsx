"use client";

import Image from "next/image";
import { ModalHeader } from "./ModalHeader";
import { CartItem, PhoneObject } from "../types/product.types";

interface OrderSummaryProps {
  data: CartItem | null;
  name: string;
  phone: PhoneObject;
  governorate: string;
  address: string;
}

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_COST = 60;

export const OrderSummary = ({ data, name, phone, governorate, address }: OrderSummaryProps) => {
  const productName = data?.productName || "منتج";
  const unitPrice = data?.price ?? 0;
  const safeQuantity = Math.max(1, Math.floor(data?.quantity || 1));
  const subtotal = unitPrice * safeQuantity;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const phoneString = `${phone.country}${phone.number}`;

  const rows = [
    { label: "الاسم", value: name || "غير محدد" },
    { label: "رقم الهاتف", value: phoneString, ltr: true },
    { label: "المحافظة", value: governorate || "غير محدد" },
    { label: "العنوان", value: address || "غير محدد" },
    { label: "المنتج", value: productName },
    { label: "المقاس", value: data?.size || "-" },
    { label: "اللون", value: data?.color || "-" },
    { label: "الكمية", value: safeQuantity.toString() },
    { label: "سعر القطعة", value: `${unitPrice.toLocaleString("en-US")} ج.م` },
    { label: "الشحن", value: shipping === 0 ? "مجاني" : `${shipping} ج.م` },
  ];

  return (
    <div className="flex-1">
      <ModalHeader
        title="ملخص الطلب"
        description="راجعي التفاصيل قبل تأكيد الطلب. الدفع كاش عند الاستلام."
      />

      <div className="flex flex-col md:flex-row gap-4 p-3 md:p-5 border border-border rounded-2xl bg-bg mt-2">
        <div className="relative w-full h-48 md:h-auto md:w-44 shrink-0 overflow-hidden rounded-xl bg-card">
          <Image
            src={data?.imageUrl || "/images/products/product-1.webp"}
            alt={productName}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 gap-0">
          {rows.map((row, i) => (
            <div key={row.label}>
              <div className="flex items-center justify-between py-2.5 px-1 gap-3">
                <span className="text-small-normal md:text-regular-normal text-paragraph shrink-0">
                  {row.label}
                </span>
                <span
                  className="text-small-bold md:text-regular-bold text-title text-left truncate"
                  dir={row.ltr ? "ltr" : undefined}
                >
                  {row.value}
                </span>
              </div>
              {i < rows.length - 1 && <div className="border-t border-border" />}
            </div>
          ))}

          <div className="mt-3 pt-3 border-t-2 border-primary flex items-center justify-between px-1">
            <span className="text-regular-bold md:heading-6-bold text-primary">
              الإجمالي (دفع عند الاستلام)
            </span>
            <span className="text-regular-bold md:heading-6-bold text-primary">
              {total.toLocaleString("en-US")} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
