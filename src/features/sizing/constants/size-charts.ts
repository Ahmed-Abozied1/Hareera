/**
 * ═══════════════════════════════════════════════════════════════════
 *  الملف ده هو المكان الوحيد اللي بيتغير بعد ما تقيس المنتجات.
 * ═══════════════════════════════════════════════════════════════════
 *
 * الأرقام دلوقتي **تقديرية** — شكلها صح لهوم وير نمطي بس مش مقاسة من
 * منتجات حريرا. لما تقيس، غيّر الأرقام هنا وبس؛ مفيش أي منطق تاني
 * محتاج يتغير.
 *
 * طريقة القياس: قطعة واحدة من كل مقاس، مفرودة والأزرار مقفولة:
 *   bust   = من تحت الإبط للتاني × ٢
 *   waist  = عند الأستك × ٢
 *   hip    = أوسع نقطة في البنطلون × ٢
 *   length = من الكتف لآخر التوب
 *
 * مهم: الأرقام دي **مقاس القطعة نفسها**، مش نطاق مقاسات الجسم.
 * الهوم وير بيتقص واسع، فربط المقاس بنطاق جسم زي الملابس المضبّطة
 * بيطلع توصية أكبر من اللازم بمقاس.
 */

export type ProductCategory = "PAJAMAS" | "ROBES";

export interface GarmentSize {
  name: string;
  /** محيط القطعة عند الصدر بالسنتيمتر */
  bust: number;
  waist: number;
  hip: number;
  length: number;
}

export interface SizeChart {
  id: ProductCategory;
  label: string;
  /** الفرق المطلوب بين القطعة والجسم حسب تفضيل العميلة، بالسنتيمتر */
  ease: Record<FitPreference, number>;
  /** أقل فرق مقبول عند الأرداف — البنطلون بيتحدد بيها مش بالصدر */
  hipEase: number;
  sizes: GarmentSize[];
}

export type FitPreference = "tight" | "regular" | "loose";
export type BodyShapeId = "hourglass" | "pear" | "apple" | "straight";

export const SIZE_CHARTS: Record<ProductCategory, SizeChart> = {
  PAJAMAS: {
    id: "PAJAMAS",
    label: "بيجامات وأطقم نوم",
    ease: { tight: 6, regular: 12, loose: 20 },
    hipEase: 8,
    sizes: [
      { name: "S", bust: 96, waist: 88, hip: 100, length: 66 },
      { name: "M", bust: 104, waist: 96, hip: 108, length: 68 },
      { name: "L", bust: 112, waist: 104, hip: 116, length: 70 },
      { name: "XL", bust: 120, waist: 112, hip: 124, length: 72 },
      { name: "2XL", bust: 130, waist: 122, hip: 134, length: 74 },
      { name: "3XL", bust: 140, waist: 132, hip: 144, length: 76 },
    ],
  },

  // الروب بيتلف من قدام فبيسامح أكتر بكتير، وعلشان كده مقاساته أقل وأوسع
  ROBES: {
    id: "ROBES",
    label: "روبات وقمصان نوم",
    ease: { tight: 10, regular: 16, loose: 26 },
    hipEase: 4,
    sizes: [
      { name: "S", bust: 98, waist: 98, hip: 104, length: 100 },
      { name: "M", bust: 108, waist: 108, hip: 114, length: 103 },
      { name: "L", bust: 120, waist: 120, hip: 126, length: 106 },
      { name: "XL", bust: 132, waist: 132, hip: 138, length: 109 },
    ],
  },
};

export interface BodyShape {
  id: BodyShapeId;
  name: string;
  hint: string;
  /** معاملات عرض السيلويت */
  bust: number;
  waist: number;
  hip: number;
  /** فروق بالسنتيمتر على القياسات المقدّرة */
  dBust: number;
  dWaist: number;
  dHip: number;
  /** نصيحة القَصّة — مالهاش علاقة بالمقاس */
  cut: string;
}

export const BODY_SHAPES: BodyShape[] = [
  {
    id: "hourglass",
    name: "ساعة رملية",
    hint: "صدر وأرداف متقاربين ووسط أضيق",
    bust: 1.03, waist: 0.9, hip: 1.03,
    dBust: 2, dWaist: -4, dHip: 3,
    cut: "القَصّات المضبّطة على الوسط هتبان أحلى عليكي",
  },
  {
    id: "pear",
    name: "كمثرى",
    hint: "الأرداف أوسع من الصدر",
    bust: 0.95, waist: 0.97, hip: 1.1,
    dBust: -2, dWaist: -2, dHip: 6,
    cut: "البنطلونات الواسعة والروب الكيمونو أريح ليكي",
  },
  {
    id: "apple",
    name: "تفاحة",
    hint: "الوزن مركّز في الوسط",
    bust: 1.05, waist: 1.12, hip: 0.96,
    dBust: 2, dWaist: 6, dHip: -2,
    cut: "القمصان المرسلة من تحت الصدر هتبقى أمريح",
  },
  {
    id: "straight",
    name: "مستقيم",
    hint: "القياسات متقاربة",
    bust: 0.98, waist: 1.04, hip: 0.98,
    dBust: 0, dWaist: 2, dHip: 0,
    cut: "الأطقم المستقيمة والساتان المنساب بيجوا حلو عليكي",
  },
];

export const FIT_OPTIONS: {
  id: FitPreference;
  name: string;
  hint: string;
  copy: string;
}[] = [
  { id: "tight", name: "على الجسم", hint: "مضبوطة", copy: "على الجسم زي ما بتحبي" },
  { id: "regular", name: "عادية", hint: "المعتاد", copy: "مظبوطة من غير ما تكون ضيقة" },
  { id: "loose", name: "واسعة", hint: "مريحة", copy: "واسعة ومريحة زي ما بتحبي" },
];

export const HEIGHT_RANGE = { min: 145, max: 190, default: 165 };
export const WEIGHT_RANGE = { min: 40, max: 130, default: 62 };
