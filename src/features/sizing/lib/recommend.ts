import {
  BODY_SHAPES,
  SIZE_CHARTS,
  type BodyShape,
  type BodyShapeId,
  type FitPreference,
  type ProductCategory,
} from "../constants/size-charts";

export interface SizeProfile {
  height: number;
  weight: number;
  shape: BodyShapeId;
  fit: FitPreference;
  /** آخر مقاس أكّدته العميلة بنفسها — بيغلب التوصية المحسوبة */
  confirmed?: Partial<Record<ProductCategory, string>>;
}

export interface BodyMeasurements {
  bust: number;
  waist: number;
  hip: number;
}

export const getShape = (id: BodyShapeId): BodyShape =>
  BODY_SHAPES.find((s) => s.id === id) ?? BODY_SHAPES[0];

/**
 * تقدير قياسات الجسم من الطول والوزن.
 *
 * معادلة خطية معايرة على جداول نسائية عامة — مش دقيقة زي المازورة، بس
 * الهوم وير بيتقص واسع فالفرق بيتبلع جوه الإيز. ودي ميزة مش عيب: العميلة
 * بتدخل رقمين هي عارفاهم بدل ما تدور على مازورة وتسيب الصفحة.
 */
export function estimateBody(profile: SizeProfile): BodyMeasurements {
  const shape = getShape(profile.shape);
  const base = 0.6 * profile.weight + 0.25 * profile.height + 10;

  return {
    bust: Math.round(base + shape.dBust),
    waist: Math.round(base - 17 + shape.dWaist),
    hip: Math.round(base + 5 + shape.dHip),
  };
}

export interface Recommendation {
  /** المقاس المقترح، أو null لو المنتج مفيهوش أي مقاس مناسب */
  size: string | null;
  body: BodyMeasurements;
  /** فرق العرض بين القطعة والجسم عند الصدر */
  slack: number | null;
  /** المقاس اتحدد بالأرداف مش بالصدر (البنطلون) */
  drivenByHip: boolean;
  /** الجسم أكبر من أوسع مقاس متاح */
  outOfRange: boolean;
  reason: string;
}

/**
 * أصغر مقاس لسه سايب المساحة المطلوبة: القطعة ≥ الجسم + الإيز.
 *
 * `available` هي مقاسات المنتج نفسه — مش كل الجدول. لو المنتج شايل S و M
 * بس، مينفعش نقترح L حتى لو هي الأنسب نظرياً.
 */
export function recommendSize(
  profile: SizeProfile,
  category: ProductCategory,
  available: string[]
): Recommendation {
  const chart = SIZE_CHARTS[category] ?? SIZE_CHARTS.PAJAMAS;
  const shape = getShape(profile.shape);
  const body = estimateBody(profile);

  const inStock = chart.sizes.filter((s) => available.includes(s.name));
  const pool = inStock.length ? inStock : chart.sizes;

  const wanted = chart.ease[profile.fit];

  const firstFitting = (need: number, key: "bust" | "hip") => {
    const i = pool.findIndex((s) => s[key] >= need);
    return i < 0 ? pool.length - 1 : i;
  };

  const byBust = firstFitting(body.bust + wanted, "bust");
  const byHip = firstFitting(body.hip + chart.hipEase, "hip");

  const index = Math.max(byBust, byHip);
  const chosen = pool[index];

  if (!chosen) {
    return {
      size: null,
      body,
      slack: null,
      drivenByHip: false,
      outOfRange: false,
      reason: "مفيش مقاسات متاحة للمنتج ده حالياً.",
    };
  }

  const widest = pool[pool.length - 1];
  const outOfRange = body.bust + wanted > widest.bust;
  const slack = chosen.bust - body.bust;
  const drivenByHip = byHip > byBust;

  const bits: string[] = [];
  if (outOfRange) {
    bits.push("ده أوسع مقاس متاح في المنتج ده");
  } else {
    const fitCopy =
      profile.fit === "loose"
        ? "واسعة ومريحة زي ما بتحبي"
        : profile.fit === "tight"
          ? "على الجسم زي ما بتحبي"
          : "مظبوطة من غير ما تكون ضيقة";
    bits.push(`القطعة أوسع من جسمك بـ ${slack} سم — ${fitCopy}`);
  }
  if (drivenByHip) bits.push("اخترناه على أساس الأرداف عشان البنطلون يريّح");
  bits.push(shape.cut);

  return {
    size: chosen.name,
    body,
    slack,
    drivenByHip,
    outOfRange,
    reason: bits.join(" · ") + ".",
  };
}

/** التوصية النهائية: اللي العميلة أكّدته بنفسها بيغلب الحساب. */
export function resolveSize(
  profile: SizeProfile,
  category: ProductCategory,
  available: string[]
): { size: string | null; fromCustomer: boolean } {
  const confirmed = profile.confirmed?.[category];
  if (confirmed && available.includes(confirmed)) {
    return { size: confirmed, fromCustomer: true };
  }
  return { size: recommendSize(profile, category, available).size, fromCustomer: false };
}
