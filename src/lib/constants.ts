import { ShoppingCart } from "@/components/ui/icons/ShoppingCart";
import { Dashboard } from "@/components/ui/icons/Dashboard";
import { UserMultiple } from "@/components/ui/icons/UserMultiple";
import { Facebook } from "@/components/ui/icons/Facebook";
import { Instagram } from "@/components/ui/icons/Instagram";
import { Package,Star } from "lucide-react";

export const NAV_LINKS = [
  { name: "الرئيسية", href: "/" },
  { name: "المتجر", href: "/shop" },
  { name: "آراء العملاء", href: "/#testimonials" },
  { name: "تواصل معنا", href: "https://wa.me/201037053149", isExternal: true },
];

export const SOCIAL_LINKS = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/Hareera.YM",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/hareera.ym/",
  },
];

export const PRODUCTS_DATA = {
  inside: [
    {
      id: "1",
      name: "كبش",
      description: "كبش (صدقة، عقيقة، أضحية) مع توثيق فيديو باسمك",
      type: "كبش",
      beneficiaries: "10-20",
      price: 20000,
      image: "/images/products/sheep.webp",
      category: "خروف",
      location: "INSIDE_EGYPT"
    },
    {
      id: "2",
      name: "بقرة",
      description: "كبش (صدقة، عقيقة، أضحية) مع توثيق فيديو باسمك",
      type: "بقرة",
      beneficiaries: "100-120",
      price: 100000,
      image: "/images/products/cow.webp",
      category: "بقرة",
      location: "INSIDE_EGYPT"
    },
  ],
  outside: [
    {
      id: "3",
      name: "كبش",
      description: "كبش (صدقة، عقيقة، أضحية) مع توثيق فيديو باسمك",
      type: "كبش",
      beneficiaries: "10-20",
      price: 25000,
      image: "/images/products/sheep.webp",
      category: "خروف",
      location: "OUTSIDE_EGYPT"
    },
    {
      id: "4",
      name: "بقرة",
      description: "كبش (صدقة، عقيقة، أضحية) مع توثيق فيديو باسمك",
      type: "بقرة",
      beneficiaries: "100-120",
      price: 120000,
      image: "/images/products/cow.webp",
      category: "بقرة",
      location: "OUTSIDE_EGYPT"
    },
  ],
} as const;

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "منى أحمد",
    initial: "م",
    rating: 5,
    content: "الخامات ممتازة وناعمة على بشرة بنتي، والمقاسات مظبوطة. التوصيل كان سريع والدفع عند الاستلام سهّل عليّا كتير."
  },
  {
    id: 2,
    name: "سارة محمود",
    initial: "س",
    rating: 5,
    content: "أول مرة أطلب وانبهرت بجودة القماش والتشطيب. الألوان زي ما هي في الصور بالظبط. هطلب تاني أكيد."
  },
  {
    id: 3,
    name: "دينا علي",
    initial: "د",
    rating: 4,
    content: "تشكيلة حلوة وأسعار مناسبة، وخدمة العملاء ردّت عليّا بسرعة وساعدتني أختار المقاس الصح لبنتي."
  }
]

export const STATS_DATA = [
  { value: "5,000+", label: "قطعة تم بيعها" },
  { value: "3,000+", label: "عميلة سعيدة" },
  { value: "98%", label: "رضا العملاء" },
  { value: "27", label: "محافظة نشحن لها" }
]

export const FAQ_DATA = [
  {
    id: "fq-1",
    question: "1. إزاي أختار المقاس المناسب؟",
    answer: "في كل منتج جدول مقاسات (S / M / L / XL) بيوضح القياسات بالسنتيمتر. لو محتاجة مساعدة كلمينا على واتساب وهنساعدك تختاري المقاس الصح."
  },
  {
    id: "fq-2",
    question: "2. طرق الدفع المتاحة؟",
    answer: "الدفع عند الاستلام (كاش) متاح لكل المحافظات. بتأكدي الأوردر وتستلمي وتدفعي عند الباب."
  },
  {
    id: "fq-3",
    question: "3. مدة وتكلفة الشحن؟",
    answer: "التوصيل من 2 لـ 5 أيام عمل حسب المحافظة. مصاريف الشحن بتتحسب عند تأكيد الأوردر، وفي شحن مجاني للطلبات فوق حد معيّن."
  },
  {
    id: "fq-4",
    question: "4. هل يمكن الاستبدال أو الاسترجاع؟",
    answer: "نعم، يمكن الاستبدال أو الاسترجاع خلال 14 يوم من الاستلام بشرط أن تكون القطعة بحالتها الأصلية وبالتيكت. راجعي سياسة الاسترجاع لمزيد من التفاصيل."
  }
]

export const MENU_ITEMS = [
  { name: "لوحة التحكم", icon: Dashboard, href: "/admin", active: true },
  { name: "إدارة الحسابات", icon: UserMultiple, href: "/admin/accounts" },
  { name: "إدارة الطلبات", icon: ShoppingCart, href: "/admin/orders" },
  { name: "إدارة المنتجات", icon: Package, href: "/admin/products" },
  { name: "إدارة التقييمات", icon: Star, href: "/admin/reviews" },
];

export const HIDDEN_PATHS = ["/product", "/profile"];




export const FOOTER_LINK1 = [
    { name: "من نحن", href: "/about" },
    { name: "سياسة الاستخدام والخصوصية", href: "/privacy" },
    { name: "سياسة الاستبدال والاسترجاع", href: "/returns" },
    { name: "الأسئلة الشائعة", href: "/faq" },
  ];

  export const FOOTER_LINK2 = [
    { name: "المتجر", href: "/shop" },
    { name: "دليل المقاسات", href: "/guide" },
    { name: "تواصل معنا", href: "https://wa.me/201037053149" },
  ];










