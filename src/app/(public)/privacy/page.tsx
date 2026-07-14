import ContentPage from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية |  Hareera',
};

export default function PrivacyPage() {
  const pClass =
    "text-paragraph text-regular-normal md:text-regular-medium leading-7";

  const sectionTitle =
    "text-title text-medium-bold md:text-large-bold";

  return (
    <ContentPage title="سياسة الخصوصية">
      <div className="space-y-10">

        <div className="space-y-4">
          <h3 className={sectionTitle}>حماية البيانات</h3>

          <p className={pClass}>
            نولي في{" "}
            <span className="text-primary font-bold">Hareera</span>{" "}
            أهمية قصوى لخصوصية وأمان بيانات عميلاتنا، ونؤكد أننا لا نقوم بمشاركة أو بيع أي معلومات شخصية لأي طرف ثالث.
          </p>

          <p className={pClass}>
            نجمع بياناتك الشخصية (الاسم، رقم الهاتف، والعنوان) فقط بهدف تنفيذ طلبك وتوصيله إليك بشكل صحيح، ونلتزم بحمايتها سواء أثناء نقلها عبر الإنترنت أو بعد تخزينها داخل أنظمتنا.
          </p>

          <p className={pClass}>
            نستخدم مجموعة متنوعة من الوسائل والتقنيات الأمنية لحماية بياناتك من الوصول أو الاستخدام أو الإفصاح غير المصرح به، ويتم تخزين المعلومات على أنظمة آمنة ذات صلاحيات محدودة، كما يتم تدريب فريق العمل بشكل مستمر على أفضل ممارسات حماية البيانات.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>وسيلة الدفع</h3>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-4">
            <p className={pClass}>
              تعتمد{" "}
              <span className="text-primary font-bold">Hareera</span>{" "}
              على الدفع عند الاستلام (كاش) فقط، حيث تدفعين قيمة طلبك نقدًا لمندوب الشحن عند استلام القطعة.
            </p>

            <p className={pClass}>
              لا يوجد دفع أونلاين على الموقع، ولا نقوم بجمع أو تخزين أي بيانات بنكية أو معلومات خاصة ببطاقات الدفع.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>خصوصية الحساب</h3>

          <ul className="space-y-3">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <p className={pClass}>
                أنتِ المسؤولة بشكل كامل عن الحفاظ على سرية بيانات حسابك وكلمة المرور الخاصة بك، وكذلك عن جميع الأنشطة التي تتم من خلال حسابك.
              </p>
            </li>

            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <p className={pClass}>
                في حال كان عمرك أقل من 18 عامًا، يجب استخدام الموقع تحت إشراف أحد الوالدين أو ولي الأمر.
              </p>
            </li>

            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <p className={pClass}>
                نحتفظ بحقنا في رفض تقديم الخدمة، أو إيقاف الحسابات، أو تعديل أو حذف أي محتوى، أو إلغاء الطلبات وفقًا لما نراه مناسبًا.
              </p>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>استخدام البيانات والتواصل</h3>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <p className={pClass}>
              بإتمامك عملية الطلب من{" "}
              <span className="text-primary font-bold">Hareera</span>{" "}
              فإنك توافقين على استخدام بياناتك لتأكيد الطلب وتنسيق الشحن والتواصل معك عبر الواتساب أو الهاتف على الرقم 01037053149.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className={sectionTitle}>الشحن والتوصيل</h3>

          <p className={pClass}>
            نقوم بالشحن لكل محافظات مصر خلال 2-5 أيام عمل، مع شحن مجاني للطلبات فوق 1500 جنيه، ويتم استخدام بيانات العنوان الخاصة بك فقط لغرض توصيل الطلب إليك.
          </p>
        </div>

      </div>
    </ContentPage>
  );
}
