'use client'

import { useEffect, useRef } from 'react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ProductsCarousel } from './ProductsCarousel'
import { ProductsTabs } from './ProductsTabs'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Product } from '../../types'

interface ProductsProps {
  products: Product[]
  loading: boolean
  error: unknown
  refetch: () => void
  activeTab: 'PAJAMAS' | 'ROBES'
  onTabChange: (value: 'PAJAMAS' | 'ROBES') => void
}

export const Products = ({
  products,
  loading,
  error,
  refetch,
  activeTab,
  onTabChange
}: ProductsProps) => {
  const sectionRef = useRef<HTMLElement>(null)

  const handleTabChange = (value: 'PAJAMAS' | 'ROBES') => {
    onTabChange(value)
  }

  return (
    <section ref={sectionRef} id="products" className="py-12 md:py-24 pr-4 sm:pr-16 bg-bg">
      <SectionHeader
        badge="تشكيلتنا"
        title="وصل حديثاً"
        description="اكتشفي أحدث تشكيلات Hareera من البيجامات وأطقم النوم والروبات بخامات ناعمة وألوان أنيقة"
      />
      <ProductsTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      <div className="relative mt-8 md:mt-12">
        {Boolean(error) && (
          <ErrorMessage message="عذرًا، حدث خطأ أثناء جلب البيانات." onRetry={refetch} />
        )}
        <ProductsCarousel products={products} loading={loading} />
      </div>
    </section>
  )
}