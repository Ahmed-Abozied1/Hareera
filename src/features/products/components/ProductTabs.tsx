"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductDescription } from "./ProductDescription";
import { ProductReviews } from "./ProductReviews";

const TABS = [
  { id: "about", label: "نبذة" },
  { id: "reviews", label: "التقييمات" },
];

interface ProductTabsProps {
  productId: string;
}

export const ProductTabs = ({ productId }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <section className="container mt-10">
      <div className="flex items-center gap-4 mb-6 md:mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "gap-2 md:gap-4 px-2 md:px-8 py-2.75 md:py-3.5 text-medium-bold lg:text-large-bold cursor-pointer",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-paragraph"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "about" && <ProductDescription />}
        {activeTab === "reviews" && <ProductReviews productId={productId} />}
      </div>
    </section>
  );
};
