import ContentPage from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'من نحن | Hareera ',
};

export default function AboutPage() {
  const pClass =
    "text-paragraph text-regular-normal md:text-regular-medium";

  return (
    <ContentPage title="من نحن">
      <div className="space-y-8">

        <p className={pClass}>
          نحن{" "}
          <span className="text-primary text-medium-medium md:text-medium-bold">
            Hareera
          </span>
          ، متجر مصري متخصص في ملابس النوم والملابس البيتية الحريمي، شعارنا
          &quot;راحتك وأناقتك أولويتنا&quot;، ونؤمن أن كل سيدة تستحق أن تشعر بالراحة
          والأناقة في بيتها.
        </p>

        <p className={pClass}>
          نقدّم مجموعة متنوعة من التصاميم العصرية المصنوعة من أجود أنواع
          الأقمشة المريحة، مع الالتزام بأعلى معايير الجودة في كل قطعة نقدمها
          لعميلاتنا.
        </p>

        <p className={pClass}>
          نوفر لكِ تشكيلة واسعة تناسب كل الأذواق والمقاسات، تشمل:
        </p>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {['بيجامات', 'أطقم نوم ساتان', 'روبات', 'قمصان نوم'].map((item) => (
            <li
              key={item}
              className="bg-card border border-border rounded-xl py-3 text-medium-medium hover:bg-secondary/10 hover:scale-[1.02] transition-all duration-200"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition">
          <p className="text-primary text-medium-bold mb-3">
            نهتم بأدق التفاصيل في كل خطوة:
          </p>

          <p className={pClass}>
            بدءًا من اختيار الأقمشة المريحة بعناية، مرورًا بتصميم القصّات
            الأنيقة والمقاسات الدقيقة (S / M / L / XL)، وحتى تجهيز وتوصيل طلبك
            بالدفع عند الاستلام، بما يضمن راحتك وثقتك في الخدمة المقدمة.
          </p>
        </div>

        <p className={pClass}>
          ومن خلال هذه الرؤية، نسعى لتقديم تجربة تسوّق سهلة وممتعة تجمع بين
          الراحة والأناقة، مع تطوير مستمر لتشكيلاتنا لتلبية تطلعات عميلاتنا في
          كل محافظات مصر.
        </p>

      </div>
    </ContentPage>
  );
}
