"use client";

import { CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "اختيار المقاس ",
    description:
      "اختاري المقاس المناسب لك من (S / M / L / XL) حسب جدول القياسات.",
  },
  {
    id: 2,
    title: "تأكيد الطلب",
    description:
      "أضيفي القطعة للسلة وأكدي الأوردر ببياناتك وعنوان التوصيل.",
  },
  {
    id: 3,
    title: "الشحن والتوصيل",
    description:
      "بنشحن لكل محافظات مصر، والتوصيل من 2 لـ 5 أيام، وشحن مجاني فوق 1500 جنيه.",
  },
  {
    id: 4,
    title: "الاستلام والدفع",
    description:
      "بتستلمي طلبك وتدفعي كاش عند الاستلام، مع استبدال أو استرجاع خلال 14 يوم.",
  },
];
export const ProductDocumentation = () => {
  return (
    <div className="">
      <h3 className="heading-6-bold md:heading-5-bold text-title mb-4">خطوات الطلب</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 p-2">
        {STEPS.map((step) => (
          <div 
            key={step.id} 
            className="flex flex-col items-center gap-2 text-center p-4 bg-bg rounded-3xl shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)]!"
          >
              <CheckCircle2 fill="currentColor" className="w-7.25 md:w-9 h-7.25 md:h-9 text-bg fill-success" />
            
            <h4 className="text-small-bold md:text-regular-bold text-title mt-0 md:mt-2">
              {step.title}
            </h4>
            
            <p className="text-small-normal md:text-regular-normal text-paragraph">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};