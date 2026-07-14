"use client";

import { useEffect, useState } from "react";
import { Grid2x2, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductSkeleton } from "@/features/home/components/Products/ProductSkeleton";
import { Product } from "@/features/home/types";

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "PAJAMAS", label: "بيجامات وأطقم نوم" },
  { id: "ROBES", label: "روبات وقمصان نوم" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export const ShopContent = () => {
  const [category, setCategory] = useState<FilterId>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileCols, setMobileCols] = useState<1 | 2>(2);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const query = category === "all" ? "" : `?category=${category}`;
    fetch(`/api/products${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (active) setProducts(data.data || []);
      })
      .catch(() => active && setProducts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [category]);

  return (
    <main className="min-h-screen pt-28 md:pt-36 pb-16">
      <section className="container">
        <div className="text-center mb-8">
          <h1 className="heading-4-bold md:heading-2 text-title">المتجر</h1>
          <p className="text-medium-normal text-paragraph mt-2">
            اكتشفي تشكيلة Hareera الكاملة — الدفع عند الاستلام
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-6 md:mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setCategory(f.id)}
              className={cn(
                "px-4 md:px-6 py-2.5 rounded-full border border-primary text-small-bold md:text-medium-bold transition-all cursor-pointer",
                "hover:bg-primary/10 hover:text-primary",
                category === f.id ? "bg-primary text-bg border-0" : "text-paragraph"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Mobile view toggle — left aligned, borderless */}
        <div className="flex md:hidden items-center justify-end gap-3 mb-4">
          <button onClick={() => setMobileCols(2)} aria-label="عرض شبكي" className="cursor-pointer">
            <Grid2x2 strokeWidth={1.75} className={cn("w-5 h-5 transition-colors", mobileCols === 2 ? "text-primary" : "text-disabled")} />
          </button>
          <button onClick={() => setMobileCols(1)} aria-label="عرض عمود واحد" className="cursor-pointer">
            <Square strokeWidth={1.75} className={cn("w-5 h-5 transition-colors", mobileCols === 1 ? "text-primary" : "text-disabled")} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center py-20 text-paragraph text-large-normal">
            لا توجد منتجات في هذا القسم حالياً
          </p>
        ) : (
          <div
            key={mobileCols}
            className={cn(
              "grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ease-out",
              mobileCols === 1 ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {products.map((product) => (
              <ProductCard key={product.id} {...product} list={mobileCols === 1} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
