"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/features/home/components/Hero";
import { ProductGrid } from "@/features/home/components/Products/ProductGrid";
import { Testimonials } from "@/features/home/components/Testimonials";
import { useTestimonial } from "../hooks/useTestimonial";
import { Product } from "../types";

const CATEGORY_TABS = [
  { id: "PAJAMAS", label: "بيجامات وأطقم نوم" },
  { id: "ROBES", label: "روبات وقمصان نوم" },
];

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("PAJAMAS");

  const {
    testimonials = [],
    loading: testimonialsLoading,
    error: testimonialsError,
    refetch: refetchTestimonials,
  } = useTestimonial();

  useEffect(() => {
    let active = true;
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((data) => active && setAllProducts(data.data || []))
      .catch(() => active && setAllProducts([]))
      .finally(() => active && setProductsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const newArrivals = allProducts.filter((p) => p.category === activeTab);

  const offers = allProducts.filter((p) => p.comparePrice && p.comparePrice > p.price);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Hero />

      <ProductGrid
        key={activeTab}
        badge="تشكيلتنا"
        title="وصل حديثاً"
        description="اكتشفي أحدث تشكيلات Hareera من البيجامات وأطقم النوم والروبات بخامات ناعمة وألوان أنيقة"
        products={newArrivals}
        loading={productsLoading}
        tabs={CATEGORY_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {(productsLoading || offers.length > 0) && (
        <div className="bg-accent-soft">
          <ProductGrid
            badge="وفّري أكتر"
            title="عروض وتخفيضات"
            description="اطلبي قطعك المفضلة بأحسن سعر قبل نفاد الكمية"
            products={offers}
            loading={productsLoading}
          />
        </div>
      )}

      <Testimonials
        testimonials={testimonials}
        loading={testimonialsLoading}
        error={testimonialsError}
        refetch={refetchTestimonials}
      />
    </main>
  );
}
