"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, X, Truck } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const FREE_SHIPPING_THRESHOLD = 1500;

export const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const goCheckout = () => {
    closeCart();
    router.push("/cart");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel — slides from the left */}
      <aside
        dir="rtl"
        className={`fixed top-0 left-0 z-[61] h-full w-full max-w-md bg-bg shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
          <button onClick={closeCart} aria-label="إغلاق" className="text-title hover:text-primary cursor-pointer">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-title">عربة التسوق ({count})</h2>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-base text-paragraph">سلتك فارغة</p>
            <button onClick={goCheckoutEmpty(closeCart, router)} className="bg-primary text-bg font-bold px-8 py-3 rounded-full">
              تسوّقي الآن
            </button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-4 bg-card/60 shrink-0">
              <div className="flex items-center gap-2 text-sm text-title mb-2">
                <Truck className="w-4 h-4 text-primary" />
                {remaining === 0 ? (
                  <span className="font-bold text-success">مبروك! حصلتي على شحن مجاني</span>
                ) : (
                  <span>
                    أضيفي بـ <span className="font-bold text-primary">{remaining} ج.م</span> واستمتعي بالشحن المجاني
                  </span>
                )}
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-border">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 py-4">
                  <div className="relative w-20 h-24 shrink-0 rounded-lg overflow-hidden bg-card">
                    <Image src={item.imageUrl || "/images/products/product-1.webp"} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex flex-col flex-1 gap-1">
                    <h3 className="text-sm font-bold text-title line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-paragraph">المقاس: {item.size} — {item.color}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-error">{item.price} ج.م</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="text-loading hover:text-error p-1.5 cursor-pointer"
                        aria-label="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-5 py-4 shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-title">المجموع الفرعي</span>
                <span className="text-lg font-bold text-primary">{subtotal} ج.م</span>
              </div>
              <p className="text-xs text-loading text-center">تُحسب مصاريف الشحن عند إتمام الطلب</p>
              <button
                onClick={goCheckout}
                className="w-full bg-primary text-bg text-base font-bold py-3.5 rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
              >
                إتمام الطلب — الدفع عند الاستلام
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

function goCheckoutEmpty(
  closeCart: () => void,
  router: ReturnType<typeof useRouter>
) {
  return () => {
    closeCart();
    router.push("/shop");
  };
}
