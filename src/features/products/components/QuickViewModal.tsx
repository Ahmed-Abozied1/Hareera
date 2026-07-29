"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { useCartStore } from "@/store/useCartStore";
import { useProduct } from "../hooks/useProduct";
import { ProductQuantity } from "@/components/common/ProductQuantity";
import { AppButton } from "@/components/common/AppButton";

export const QuickViewModal = ({
  data,
}: {
  data?: { productId?: string; product?: import("../types/product.types").Product };
}) => {
  const passedProduct = data?.product ?? null;
  const productId = data?.productId || passedProduct?.id || "";
  const { product: fetched, loading: fetching } = useProduct(productId, passedProduct);
  const product = passedProduct ?? fetched;
  const loading = !product && fetching;
  const { close } = useModalStore();
  const addItem = useCartStore((s) => s.addItem);
  const closeCart = useCartStore((s) => s.closeCart);
  const router = useRouter();

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const hasDiscount = !!product.comparePrice && product.comparePrice > product.price;
  const currentSize = size || sizes[0] || "";
  const currentColor = color || colors[0] || "";
  const inStock = (product.stock ?? 0) > 0;

  const buildLine = () => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl || undefined,
    size: currentSize,
    color: currentColor,
    quantity,
  });

  const handleAddToCart = () => {
    if (sizes.length && !currentSize) return toast.error("اختاري المقاس");
    if (colors.length && !currentColor) return toast.error("اختاري اللون");
    addItem(buildLine());
    toast.success("تمت الإضافة إلى السلة");
    close();
  };

  const handleBuyNow = () => {
    if (sizes.length && !currentSize) return toast.error("اختاري المقاس");
    if (colors.length && !currentColor) return toast.error("اختاري اللون");
    addItem(buildLine());
    close();
    closeCart();
    router.push("/cart");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6" dir="rtl">
      <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-card">
        <Image src={product.imageUrl || "/images/products/product-1.webp"} alt={product.name} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-3">
        <Link href={`/product/${product.id}`} onClick={close} className="hover:text-primary transition-colors">
          <h2 className="text-xl md:text-2xl font-bold text-title">{product.name}</h2>
        </Link>

        <div className="flex items-baseline gap-3">
          <span className="text-xl font-bold text-brand-deep">{product.price} ج.م</span>
          {hasDiscount && (
            <span className="text-base text-loading line-through">{product.comparePrice} ج.م</span>
          )}
        </div>

        <p className="text-sm md:text-base text-paragraph leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {sizes.length > 0 && (
          <div>
            <span className="text-sm font-bold text-title">المقاس: {currentSize}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "min-w-12 h-11 px-3 rounded-lg border text-sm font-bold transition cursor-pointer",
                    currentSize === s
                      ? "bg-brand-soft text-primary border-primary"
                      : "border-border text-title hover:border-primary"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div>
            <span className="text-sm font-bold text-title">اللون: {currentColor}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "px-4 h-11 rounded-lg border text-sm font-medium transition cursor-pointer",
                    currentColor === c
                      ? "bg-brand-soft text-primary border-primary"
                      : "border-border text-title hover:border-primary"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-1">
          <ProductQuantity value={quantity} onChange={setQuantity} min={1} max={99} />
          <AppButton onClick={handleAddToCart} disabled={!inStock} className="flex-1 h-12 rounded-full">
            {inStock ? "أضيفي للسلة" : "غير متوفر"}
          </AppButton>
        </div>

        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="w-full h-12 rounded-full border border-primary text-primary text-base font-bold hover:bg-brand-soft transition-colors cursor-pointer disabled:opacity-50"
        >
          اشتري الآن
        </button>

        <p className="text-xs text-loading text-center">الدفع عند الاستلام — شحن لكل المحافظات</p>
      </div>
    </div>
  );
};
