"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { GOVERNORATES } from "@/features/products/constants";
import { AppButton } from "@/components/common/AppButton";

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_COST = 60;

export const CartContent = () => {
  const { items, updateQuantity, removeItem, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (!name.trim() || !phone.trim() || !governorate || !address.trim()) {
      toast.error("يرجى ملء جميع بيانات الشحن");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("رقم الهاتف غير صحيح");
      return;
    }

    setSubmitting(true);
    try {
      const results = await Promise.all(
        items.map((item) =>
          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.price,
              customerName: name.trim(),
              phone: phone.trim(),
              governorate,
              address: address.trim(),
              notes: notes.trim() || undefined,
            }),
          }).then((r) => r.ok)
        )
      );

      if (results.every(Boolean)) {
        clear();
        setDone(true);
      } else {
        toast.error("حدث خطأ في بعض المنتجات، حاولي مرة أخرى");
      }
    } catch {
      toast.error("تعذّر إتمام الطلب، تحققي من الاتصال");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return <main className="min-h-screen pt-40" />;
  }

  if (done) {
    return (
      <main className="min-h-screen pt-40 pb-16">
        <div className="container max-w-lg text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-success/10 text-success flex items-center justify-center text-4xl">
            ✓
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-title">تم استلام طلبك!</h1>
          <p className="text-base text-paragraph">
            هنتواصل معاكِ على رقمك لتأكيد الطلب والتوصيل. الدفع عند الاستلام.
          </p>
          <Link href="/shop" className="mt-2 bg-primary text-bg font-bold px-10 py-3 rounded-full hover:bg-primary/90 transition-colors">
            مواصلة التسوق
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-40 pb-16">
        <div className="container max-w-lg text-center flex flex-col items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-title">السلة فارغة</h1>
          <p className="text-base text-paragraph">لسه ماضفتيش أي منتج لسلتك.</p>
          <Link href="/shop" className="bg-primary text-bg font-bold px-10 py-3 rounded-full hover:bg-primary/90 transition-colors">
            تسوّقي الآن
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 md:pt-40 pb-16">
      <div className="container">
        <h1 className="text-2xl md:text-3xl font-bold text-title mb-6 md:mb-8">عربة التسوق</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-4 p-3 md:p-4 border border-border rounded-2xl"
              >
                <div className="relative w-24 h-28 md:w-28 md:h-32 shrink-0 rounded-xl overflow-hidden bg-card">
                  <Image src={item.imageUrl || "/images/products/product-1.webp"} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="text-base font-bold text-title line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-paragraph">المقاس: {item.size} — اللون: {item.color}</p>
                  <span className="text-base font-bold text-brand-deep">{item.price} ج.م</span>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-title cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-title cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-error hover:bg-error/10 p-2 rounded-lg cursor-pointer"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary + shipping */}
          <div className="space-y-4">
            <div className="border border-border rounded-2xl p-5 space-y-3">
              <h2 className="text-lg font-bold text-title">ملخص الطلب</h2>
              <div className="flex justify-between text-sm text-paragraph">
                <span>الإجمالي الفرعي</span>
                <span className="font-bold text-brand-deep">{subtotal} ج.م</span>
              </div>
              <div className="flex justify-between text-sm text-paragraph">
                <span>الشحن</span>
                <span className="font-bold text-brand-deep">{shipping === 0 ? "مجاني" : `${shipping} ج.م`}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-base font-bold text-primary">الإجمالي</span>
                <span className="text-base font-bold text-brand-deep">{total} ج.م</span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-loading">
                  أضيفي بـ {FREE_SHIPPING_THRESHOLD - subtotal} ج.م للحصول على شحن مجاني
                </p>
              )}
            </div>

            <div className="border border-border rounded-2xl p-5 space-y-3">
              <h2 className="text-lg font-bold text-title">بيانات الشحن</h2>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم بالكامل"
                className="w-full h-11 px-4 text-right border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف / الواتساب" dir="ltr"
                className="w-full h-11 px-4 text-right border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              <select value={governorate} onChange={(e) => setGovernorate(e.target.value)}
                className="w-full h-11 px-4 text-right border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">اختاري المحافظة</option>
                {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} placeholder="العنوان بالتفصيل"
                className="w-full px-4 py-3 text-right border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="ملاحظات (اختياري)"
                className="w-full px-4 py-3 text-right border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary" />

              <AppButton onClick={handlePlaceOrder} isLoading={submitting} className="w-full h-12 rounded-full">
                تأكيد الطلب (دفع عند الاستلام)
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
