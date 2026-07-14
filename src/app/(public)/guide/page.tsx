import ContentPage from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'دليل المقاسات |  Hareera',
};

export default function GuidePage() {
  const pClass = "text-paragraph text-regular-normal md:text-regular-medium leading-7";
  const sectionTitle = "text-title text-medium-bold md:text-large-bold";

  return (
    <ContentPage title="دليل المقاسات">
      <div className="space-y-10">

        <p className={pClass}>
          في <span className="text-primary font-bold"> Hareera</span>، نوفر لكِ ملابس نوم وبيتي حريمي بمقاسات S / M / L / XL، حتى تختاري القطعة المريحة والمناسبة لكِ تمامًا بكل سهولة من خلال موقعنا الإلكتروني.
        </p>

        <p className={pClass}>
          ويهدف هذا الدليل إلى مساعدتك في اختيار المقاس الأنسب لجسمك بكل وضوح وسهولة، حتى تستمتعي بالراحة والأناقة في بيتك.
        </p>

        <div className="space-y-6">
          <h3 className={sectionTitle}>أولاً: كيف تختارين مقاسك الصحيح؟</h3>
          <p className={pClass}>(ننصح بأخذ قياساتك بشريط قياس فوق ملابس خفيفة للحصول على أدق نتيجة)</p>

          <ul className="list-disc list-inside space-y-2">
            <li className={pClass}>قيسي محيط الصدر عند أوسع نقطة.</li>
            <li className={pClass}>
              قارني قياساتك بالجدول التالي لاختيار المقاس:
              <ul className="list-inside list-decimal ml-4 mt-1 space-y-1">
                <li>مقاس S: يناسب الوزن التقريبي من 45 إلى 55 كجم</li>
                <li>مقاس M: يناسب الوزن التقريبي من 55 إلى 68 كجم</li>
                <li>مقاس L: يناسب الوزن التقريبي من 68 إلى 80 كجم</li>
                <li>مقاس XL: يناسب الوزن التقريبي من 80 إلى 92 كجم</li>
              </ul>
            </li>
            <li className={pClass}>لو قياساتك بين مقاسين، ننصح باختيار المقاس الأكبر لراحة أكثر.</li>
            <li className={pClass}>لو محتارة في المقاس، تواصلي معنا على الواتساب 01037053149 وهنساعدك في الاختيار.</li>
          </ul>

          <h4 className="text-medium-bold md:text-large-bold mt-4">جدول المقاسات التقريبي</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {[
              { name: "مقاس S", chest: "محيط الصدر: 84–88 سم", hip: "محيط الأرداف: 90–94 سم" },
              { name: "مقاس M", chest: "محيط الصدر: 88–94 سم", hip: "محيط الأرداف: 94–100 سم" },
              { name: "مقاس L", chest: "محيط الصدر: 94–100 سم", hip: "محيط الأرداف: 100–106 سم" },
              { name: "مقاس XL", chest: "محيط الصدر: 100–108 سم", hip: "محيط الأرداف: 106–114 سم" },
            ].map((item) => (
              <div key={item.name} className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm">
                <p className="text-medium-bold text-primary">{item.name}</p>
                <p className={pClass}>{item.chest}</p>
                <p className={pClass}>{item.hip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className={sectionTitle}>ثانيًا: اختيار القطعة المناسبة</h3>
          <p className={pClass}>تختلف القصّة حسب نوع القطعة، لذلك ننصح بمراجعة تفاصيل كل منتج قبل الطلب.</p>

          <ul className="list-disc list-inside space-y-2">
            <li className={pClass}>البيجامات وأطقم النوم: قصّات مريحة تناسب الاستخدام اليومي ووقت النوم.</li>
            <li className={pClass}>الروبات وقمصان النوم: تصاميم أنيقة، ننصح باختيار المقاس المريح حسب رغبتك في الاتساع.</li>
          </ul>

          <h4 className="text-medium-bold md:text-large-bold mt-4">أنواع الأقمشة لدينا</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {[
              { name: "ساتان", light: "خفيف وناعم على الجسم", use: "مثالي لأطقم النوم الأنيقة" },
              { name: "قطن مريح", light: "قابل للتنفس ولطيف على البشرة", use: "مناسب للاستخدام اليومي والبيتي" },
            ].map((item) => (
              <div key={item.name} className="bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm">
                <p className="text-medium-bold text-primary">{item.name}</p>
                <p className={pClass}>{item.light}</p>
                <p className={pClass}>{item.use}</p>
              </div>
            ))}
          </div>

          <p className={pClass}>
            ننصح دائمًا بمراجعة المقاس المكتوب في وصف كل منتج، لأن بعض التصاميم قد تكون أوسع أو أضيق قليلًا حسب القصّة والقماش.
          </p>

          <h4 className="text-medium-bold md:text-large-bold mt-4">ملاحظات مهمة</h4>
          <ul className="list-disc list-inside space-y-2">
            <li className={pClass}>جميع القطع متوفرة بمقاسات S / M / L / XL حسب المتاح لكل تصميم.</li>
            <li className={pClass}>يمكنك الاستبدال خلال 14 يومًا لو المقاس مش مناسب، بشرط أن تكون القطعة بحالتها الأصلية وبالتيكت.</li>
            <li className={pClass}>لأي استفسار عن المقاسات، تواصلي معنا على الواتساب 01037053149 وسعداء بمساعدتك.</li>
          </ul>
        </div>

      </div>
    </ContentPage>
  );
}
