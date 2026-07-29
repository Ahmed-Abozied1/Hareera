"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCardProps } from "@/features/home/types";
import { CATEGORY_LABELS } from "@/features/products/constants";
import { useModalStore } from "@/store/useModalStore";
import { productService } from "@/features/products/services/product.service";

export const ProductCard: FC<ProductCardProps & { list?: boolean }> = ({
  id,
  name,
  category,
  price,
  comparePrice,
  imageUrl,
  slug,
  list = false,
}) => {
  const href = `/product/${slug || id}`;
  const { open } = useModalStore();
  const [loadingQuick, setLoadingQuick] = useState(false);
  const hasDiscount = !!comparePrice && comparePrice > price;
  const discountPct = hasDiscount
    ? Math.round((1 - price / (comparePrice as number)) * 100)
    : 0;

  const openQuickView = async () => {
    if (loadingQuick) return;
    setLoadingQuick(true);
    try {
      const product = await productService.getProduct(id);
      open("QUICK_VIEW", { product });
    } catch {
      open("QUICK_VIEW", { productId: id });
    } finally {
      setLoadingQuick(false);
    }
  };

  return (
    <div className="group flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-5/7 md:aspect-3/4 overflow-hidden rounded-2xl bg-card">
        <Link href={href} className="block w-full h-full">
          <Image
            src={imageUrl || "/images/products/product-1.webp"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-brand-deep text-white text-xs md:text-sm font-bold px-3 py-1 rounded-lg">
            -{discountPct}%
          </span>
        )}

        {/* Desktop: button on the image (appears on hover) */}
        <button
          type="button"
          onClick={openQuickView}
          disabled={loadingQuick}
          className="hidden md:flex items-center justify-center absolute bottom-3 inset-x-3 h-12 bg-primary text-bg text-base font-bold rounded-full hover:bg-primary/90 cursor-pointer transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
        >
          {loadingQuick ? <Loader2 className="w-5 h-5 animate-spin" /> : "حدد الخيارات"}
        </button>
      </div>

      {/* Bottom */}
      <div className={cn("pt-3", list ? "flex items-center justify-between gap-4 md:block" : "")}>
        <div
          className={cn(
            "flex flex-col gap-1.5",
            list
              ? "items-start text-right grow md:items-center md:text-center"
              : "items-center text-center"
          )}
        >
          {category && (
            <span className="text-sm text-loading">
              {CATEGORY_LABELS[category] || category}
            </span>
          )}

          <Link href={href}>
            <h3 className="text-base font-bold text-title line-clamp-1 hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>

          <div className="flex items-baseline gap-2">
            <span className={cn("text-base font-bold", hasDiscount ? "text-brand-deep" : "text-title")}>
              {price} ج.م
            </span>
            {hasDiscount && (
              <span className="text-sm text-loading line-through">{comparePrice} ج.م</span>
            )}
          </div>
        </div>

        {/* Mobile: button below the image */}
        <button
          type="button"
          onClick={openQuickView}
          disabled={loadingQuick}
          className={cn(
            "md:hidden bg-primary text-bg text-sm font-bold rounded-full hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center",
            list ? "shrink-0 px-7 py-3 min-w-32" : "w-full py-3 mt-3"
          )}
        >
          {loadingQuick ? <Loader2 className="w-5 h-5 animate-spin" /> : "حدد الخيارات"}
        </button>
      </div>
    </div>
  );
};
