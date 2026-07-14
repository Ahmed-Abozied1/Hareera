import ContentPage from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الاستبدال والاسترجاع |  Hareera',
};

export default function ReturnsPage() {
  const pClass =
    "text-paragraph text-regular-normal md:text-regular-medium leading-7";

  const sectionTitle =
    "text-title text-medium-bold md:text-large-bold";

  return (
    <ContentPage title="سياسة الاستبدال والاسترجاع">
      <div className="space-y-10">

        <div className="space-y-4">
          <h3 className={sectionTitle}>مقدمة</h3>
          <p className={pClass}>
            نشكركم على ثقتكم في{" "}
            <span className="text-primary font-bold">Hareera</span>،
            ويسعدنا دائمًا أن نكون عند حسن ظنكم ونقدم لكم أفضل خدمة ممكنة.
          </p>
          <p className={pClass}>
            ندرك أنه في بعض الأحيان قد ترغب العميلة في استبدال القطعة أو استرجاعها بعد الاستلام، لذلك نوفر سياسة استبدال واسترجاع مرنة وسهلة وفقًا للشروط التالية:
          </p>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>1- مدة الاستبدال والاسترجاع</h3>
          <ul className="list-disc list-inside space-y-2">
            <li className={pClass}>
              يمكنكِ طلب الاستبدال أو الاسترجاع خلال 14 يومًا من تاريخ استلام الطلب.
            </li>
            <li className={pClass}>
              يجب أن تكون القطعة بحالتها الأصلية، غير مستعملة وغير مغسولة، وبكامل التيكت (البطاقة) الأصلي.
            </li>
            <li className={pClass}>
              يتم تقديم طلب الاستبدال أو الاسترجاع من خلال التواصل مع خدمة العملاء عبر الواتساب على الرقم 01037053149.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>2- الاستبدال (تغيير المقاس أو القطعة)</h3>
          <ul className="list-disc list-inside space-y-2">
            <li className={pClass}>
              يمكنكِ استبدال القطعة بمقاس آخر (S / M / L / XL) أو بتصميم مختلف حسب المتوفر لدينا.
            </li>
            <li className={pClass}>
              يتم إرسال القطعة البديلة مع مندوب الشحن، وتُحصّل أي فروق في السعر أو الشحن عند الاستلام.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>3- الاسترجاع واسترداد المبلغ</h3>
          <ul className="list-disc list-inside space-y-2">
            <li className={pClass}>
              نظرًا لأن الدفع يتم عند الاستلام (كاش)، يتم رد قيمة القطعة المسترجعة نقدًا بعد استلامها والتأكد من مطابقتها لشروط الاسترجاع.
            </li>
            <li className={pClass}>
              يمكنكِ اختيار استبدال القطعة بقطعة أخرى بنفس القيمة بدلًا من استرداد المبلغ.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>4- الشحن والتوصيل</h3>
          <p className={pClass}>
            نقوم بالشحن لكل محافظات مصر خلال 2-5 أيام عمل، مع شحن مجاني للطلبات فوق 1500 جنيه. في حالات الاستبدال أو الاسترجاع، يقوم فريق خدمة العملاء بتنسيق موعد استلام القطعة وإرسال البديل معك بكل سهولة.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>خدمة العملاء</h3>
          <p className={pClass}>
            نسعى دائمًا لتقديم تجربة موثوقة وسلسة لعميلاتنا، وفي حال وجود أي استفسار يسعد فريق خدمة العملاء بمساعدتكِ في أي وقت عبر الواتساب على الرقم 01037053149.
          </p>
        </div>

      </div>
    </ContentPage>
  );
}
