export const SIZES = ["S", "M", "L", "XL"] as const;

export const CATEGORIES = [
  { id: "PAJAMAS", label: "بيجامات وأطقم نوم" },
  { id: "ROBES", label: "روبات وقمصان نوم" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  PAJAMAS: "بيجامات وأطقم نوم",
  ROBES: "روبات وقمصان نوم",
};

export const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الدقهلية", "الشرقية",
  "الغربية", "المنوفية", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد",
  "الإسماعيلية", "السويس", "الفيوم", "بني سويف", "المنيا", "أسيوط",
  "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد",
  "مطروح", "شمال سيناء", "جنوب سيناء",
] as const;

export const CHECKOUT_STEPS = [
  { id: 1, label: "بيانات الشحن" },
  { id: 2, label: "ملخص الطلب" },
  { id: 3, label: "تأكيد الطلب" },
];
