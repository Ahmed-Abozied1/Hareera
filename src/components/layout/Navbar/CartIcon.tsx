"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "@/components/ui/icons/ShoppingCart";
import { useCartStore } from "@/store/useCartStore";

export const CartIcon = () => {
  const [mounted, setMounted] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => setMounted(true), []);

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
