/** المقاسات الجاهزة في فورم المنتج — والأدمن يقدر يضيف مقاس مخصص فوقهم. */
export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "مقاس واحد"] as const;

/** أقصى عدد صور للمنتج الواحد — لازم يساوي maxFileCount في uploadthing. */
export const MAX_PRODUCT_IMAGES = 6;

export const CATEGORIES = [
  { id: "PAJAMAS", label: "بيجامات وأطقم نوم" },
  { id: "ROBES", label: "روبات وقمصان نوم" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  PAJAMAS: "بيجامات وأطقم نوم",
  ROBES: "روبات وقمصان نوم",
};

/** محافظات مصر مقسّمة على مناطق — التقسيم بيخلي القايمة أسهل في المسح بالعين. */
export const GOVERNORATE_GROUPS = [
  {
    region: "القاهرة الكبرى",
    governorates: ["القاهرة", "الجيزة", "القليوبية"],
  },
  {
    region: "الإسكندرية والدلتا",
    governorates: [
      "الإسكندرية", "البحيرة", "كفر الشيخ", "الغربية",
      "المنوفية", "الدقهلية", "دمياط", "الشرقية",
    ],
  },
  {
    region: "القناة وسيناء",
    governorates: [
      "بورسعيد", "الإسماعيلية", "السويس", "شمال سيناء", "جنوب سيناء",
    ],
  },
  {
    region: "الصعيد",
    governorates: [
      "الفيوم", "بني سويف", "المنيا", "أسيوط",
      "سوهاج", "قنا", "الأقصر", "أسوان",
    ],
  },
  {
    region: "المحافظات الحدودية",
    governorates: ["البحر الأحمر", "الوادي الجديد", "مطروح"],
  },
] as const;

export const GOVERNORATES = GOVERNORATE_GROUPS.flatMap(
  (group) => group.governorates
);

export const CHECKOUT_STEPS = [
  { id: 1, label: "بيانات الشحن" },
  { id: 2, label: "ملخص الطلب" },
  { id: 3, label: "تأكيد الطلب" },
];
