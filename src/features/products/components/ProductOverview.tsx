"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/useModalStore";
import { AppButton } from "@/components/common/AppButton";
import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";
import { useEffect, useState } from "react";
import { Star } from "@/components/ui/icons/Star";
import { ProductQuantity } from "@/components/common/ProductQuantity";
import { Product } from "../types/product.types";
import { initiateCheckout } from "@/lib/pixel";
import { useSizeProfile } from "@/features/sizing/store/useSizeProfile";
import { resolveSize } from "@/features/sizing/lib/recommend";
import type { ProductCategory } from "@/features/sizing/constants/size-charts";

interface ProductOverviewProps {
  product: Product;
}

export const ProductOverview = ({ product }: ProductOverviewProps) => {
  const { open } = useModalStore();

  const sizes = product.sizes || [];
  const colors = product.colors || [];

  // المعرض: images لو موجودة، وإلا الصورة الرئيسية لوحدها (منتجات قديمة)
  const gallery = product.images?.length
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  const [pickedSize, setPickedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");
  const [activeImage, setActiveImage] = useState<string>(
    gallery[0] || "/images/products/product-1.webp"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const category = (product.category as ProductCategory) ?? "PAJAMAS";
  const profile = useSizeProfile((s) => s.profile);

  // الملف محفوظ في localStorage، والسيرفر مش شايفه — بنرطّب بعد المونت
  // عشان الرندر الأول يفضل مطابق للي جه من السيرفر.
  useEffect(() => {
    useSizeProfile.persist.rehydrate();
  }, []);

  // المقاس المقترح مشتق من الملف المحفوظ، فبنحسبه وقت الرندر بدل ما نخزنه في state.
  // اختيار المستخدمة بإيدها بيكسب عليه.
  const suggested =
    profile && sizes.length
      ? resolveSize(profile, category, sizes).size || null
      : null;
  const selectedSize = pickedSize ?? suggested ?? sizes[0] ?? "";

  const openSizeFinder = () =>
    open("SIZE_FINDER", {
      category,
      availableSizes: sizes,
      onPick: (size: string) => setPickedSize(size),
    });

  const ratingValue = typeof product?.rating === "number" ? product.rating : 0;
  const inStock = (product.stock ?? 0) > 0;
  const hasDiscount = !!product.comparePrice && product.comparePrice > product.price;

  const handleOrder = () => {
    if (!product) return;
    if (sizes.length && !selectedSize) return;
    if (colors.length && !selectedColor) return;

    setLoading(true);

    initiateCheckout({
      content_name: product.name,
      content_ids: [product.id],
      value: product.price * quantity,
      num_items: quantity,
    });

    open("BOOKING", {
      productId: product.id,
      productName: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
      imageUrl: product.imageUrl || undefined,
    });

    setLoading(false);
  };

  return (
    <section className="container mt-28 md:mt-36">
      <AppBreadcrumb
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "المتجر", href: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-10">
        <div className="flex flex-col gap-3">
          <div className="relative w-full aspect-4/3 md:aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-card">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <span className="absolute top-4 right-4 bg-brand-deep text-white text-small-bold px-3 py-1 rounded-full">
                خصم
              </span>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {gallery.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(url)}
                  aria-label={`عرض صورة ${i + 1}`}
                  className={cn(
                    "relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer bg-card",
                    activeImage === url ? "border-primary" : "border-border hover:border-brand"
                  )}
                >
                  <Image
                    src={url}
                    alt={`${product.name} — صورة ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-2 md:gap-y-4">
          <h2 className="heading-5-bold md:heading-3-bold text-title">
            {product.name}
          </h2>

          {ratingValue > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-small-normal md:text-regular-normal text-title">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < Math.floor(ratingValue) ? "text-rating" : "text-disabled"
                    )}
                  />
                ))}
              </div>
              <span>({ratingValue.toFixed(1)} نجوم)</span>
            </div>
          )}

          <p className="text-regular-normal md:heading-5-normal text-paragraph">
            {product.description}
          </p>

          <div className="flex justify-between items-center my-2 md:my-4">
            <div className="flex items-center gap-3">
              <span className="heading-5-bold md:heading-3-bold text-brand-deep">
                {product.price * quantity} ج.م
              </span>
              {hasDiscount && (
                <span className="text-medium-normal text-loading line-through">
                  {(product.comparePrice as number) * quantity} ج.م
                </span>
              )}
            </div>
            <ProductQuantity value={quantity} onChange={setQuantity} min={1} max={99} />
          </div>

          {sizes.length > 0 && (
            <>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-large-bold md:heading-5-bold text-title">المقاس</h3>
                <button
                  type="button"
                  onClick={openSizeFinder}
                  className="text-small-bold text-accent-deep underline underline-offset-4 hover:text-primary transition-colors cursor-pointer"
                >
                  {profile ? "غيّري مقاسك" : "مش عارفة مقاسك؟"}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setPickedSize(size)}
                    className={cn(
                      "min-w-14 px-4 py-3 rounded-xl border transition cursor-pointer text-regular-bold",
                      selectedSize === size
                        ? "bg-primary text-white border-primary"
                        : "border-border text-paragraph hover:border-primary"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {suggested && (
                <p className="text-small-normal text-accent-deep bg-accent-soft rounded-lg px-3 py-2">
                  مقاسك المقترح {suggested} — مختار لك تلقائياً، وتقدري تغيّريه.
                </p>
              )}
            </>
          )}

          {colors.length > 0 && (
            <>
              <h3 className="text-large-bold md:heading-5-bold text-title mt-2">اللون</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-4 py-3 rounded-xl border transition cursor-pointer text-regular-medium",
                      selectedColor === color
                        ? "bg-secondary text-white border-secondary"
                        : "border-border text-paragraph hover:border-secondary"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </>
          )}

          <AppButton
            onClick={handleOrder}
            disabled={loading || !inStock}
            className="w-full h-14 md:min-h-14 rounded-xl md:rounded-2xl text-medium-bold text-bg mt-4"
          >
            {!inStock ? "غير متوفر حالياً" : loading ? "جاري التحميل..." : "اطلبي الآن"}
          </AppButton>

          <p className="text-small-normal text-loading text-center">
            الدفع عند الاستلام — شحن لكل المحافظات
          </p>
        </div>
      </div>
    </section>
  );
};
