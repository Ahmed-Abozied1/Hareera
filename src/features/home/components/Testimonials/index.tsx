'use client'

import { SectionHeader } from '@/components/common/SectionHeader'
import { TestimonialsCarousel } from './TestimonialsCarousel'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { Testimonial } from '../../types'

interface TestimonialsProps {
  testimonials: Testimonial[]
  loading: boolean
  error: unknown
  refetch: () => void
}

export function Testimonials({ testimonials, loading, error, refetch }: TestimonialsProps) {
  if (!loading && testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-24 overflow-hidden container bg-bg" id="testimonials">
      <SectionHeader
        badge="آراء عميلاتنا"
        title="ماذا قالت عميلاتنا"
        description="آراء عميلاتنا الكرام حول جودة خامات حريرة وراحة قطع النوم والبيت وسرعة التوصيل ."
      />

      <div className="relative mt-8 md:mt-12">
        {!!error && (
          <ErrorMessage
            message="عذرًا، حدث خطأ أثناء جلب البيانات."
            onRetry={refetch}
          />
        )}

        <TestimonialsCarousel
          testimonials={testimonials}
          loading={loading}
        />
      </div>
    </section>
  )
}