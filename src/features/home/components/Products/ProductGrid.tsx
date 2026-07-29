"use client";

import { useState } from "react";
import { Grid2x2, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import { Product } from "../../types";

interface Tab {
  id: string;
  label: string;
}

interface ProductGridProps {
  badge: string;
  title: string;
  description?: string;
  products: Product[];
  loading?: boolean;
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  initialCount?: number;
}

export const ProductGrid = ({
  badge,
  title,
  description,
  products,
  loading = false,
  tabs,
  activeTab,
  onTabChange,
  initialCount = 4,
}: ProductGridProps) => {
  const [expanded, setExpanded] = useState(false);
  const [mobileCols, setMobileCols] = useState<1 | 2>(2);
  const visible = expanded ? products : products.slice(0, initialCount);
  const hasMore = products.length > initialCount;

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        {/* Section header — unified type scale */}
        <div className="text-center mb-6 md:mb-8">
          <span className="inline-block text-sm font-bold text-accent-deep bg-accent/20 rounded-full px-4 py-1.5 mb-3">
            {badge}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-title">{title}</h2>
          {description && (
            <p className="text-sm md:text-base text-paragraph mt-3 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {tabs && (
          <div className="flex justify-center flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange?.(tab.id);
                  setExpanded(false);
                }}
                className={cn(
                  "px-4 md:px-6 py-2.5 rounded-full border border-primary text-sm md:text-base font-bold transition-all cursor-pointer",
                  "hover:bg-primary/10 hover:text-primary",
                  activeTab === tab.id ? "bg-primary text-bg border-0" : "text-paragraph"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Mobile view toggle — left aligned, borderless */}
        {!loading && products.length > 0 && (
          <div className="flex md:hidden items-center justify-end gap-3 mb-4">
            <button
              onClick={() => setMobileCols(2)}
              aria-label="عرض شبكي"
              className="cursor-pointer"
            >
              <Grid2x2 strokeWidth={1.75} className={cn("w-5 h-5 transition-colors", mobileCols === 2 ? "text-primary" : "text-disabled")} />
            </button>
            <button
              onClick={() => setMobileCols(1)}
              aria-label="عرض عمود واحد"
              className="cursor-pointer"
            >
              <Square strokeWidth={1.75} className={cn("w-5 h-5 transition-colors", mobileCols === 1 ? "text-primary" : "text-disabled")} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: initialCount }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center py-12 text-paragraph text-base">لا توجد منتجات حالياً</p>
        ) : (
          <div
            key={mobileCols}
            className={cn(
              "grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ease-out",
              mobileCols === 1 ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {visible.map((product) => (
              <ProductCard key={product.id} {...product} list={mobileCols === 1} />
            ))}
          </div>
        )}

        {!loading && hasMore && (
          <div className="flex justify-center mt-8 md:mt-12">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-block bg-primary text-bg text-base font-bold px-14 py-3.5 rounded-full hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {expanded ? "عرض أقل" : "عرض المزيد"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
