"use client";

import { ShoppingCart } from "@/components/ui/icons/ShoppingCart";
import { useIsClient } from "@/hooks/useIsClient";
import { useCartStore } from "@/store/useCartStore";

export const CartIcon = () => {
  // العدد جاي من localStorage، فمابنعرضهوش غير بعد الـ hydration
  const mounted = useIsClient();
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="عربة التسوق"
      className="relative p-2.5 text-bg hover:opacity-80 transition-opacity cursor-pointer"
    >
      <ShoppingCart className="w-6 h-6" />
      {mounted && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
};
