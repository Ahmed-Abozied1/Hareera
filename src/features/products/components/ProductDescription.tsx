export const ProductDescription = () => {
  return (
    <div className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 space-y-3">
      <p className="text-regular-normal md:text-large-normal text-paragraph leading-relaxed">
        قطع مصنوعة من خامات ناعمة ومريحة على البشرة، بتشطيب راقٍ وألوان ثابتة لا تبهت مع الغسيل.
        متوفرة بمقاسات S / M / L / XL لتناسب الجميع.
      </p>
      <ul className="text-regular-normal text-paragraph list-disc pr-5 space-y-1">
        <li>خامة عالية الجودة ومريحة</li>
        <li>يُفضّل الغسيل على درجة حرارة منخفضة للحفاظ على اللون</li>
        <li>الدفع عند الاستلام والشحن لكل المحافظات</li>
        <li>إمكانية الاستبدال خلال 14 يوم</li>
      </ul>
    </div>
  );
};
