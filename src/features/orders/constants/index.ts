export const ITEMS_PER_PAGE = 10;

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'قيد المراجعة',
  CONFIRMED: 'تم التأكيد',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي',
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-[#ECEDEE] text-loading',
  CONFIRMED: 'bg-info/10 text-info',
  SHIPPED: 'bg-warning/10 text-warning',
  DELIVERED: 'bg-success/10 text-success',
  CANCELLED: 'bg-error/10 text-error',
};

export const SORT_LABELS: Record<string, string> = {
  newest: 'الأحدث',
  oldest: 'الأقدم',
  name: 'الاسم',
};

export const FILTER_OPTIONS = {
  status: [
    { value: 'all', label: 'الكل' },
    { value: 'PENDING', label: 'قيد المراجعة' },
    { value: 'CONFIRMED', label: 'تم التأكيد' },
    { value: 'SHIPPED', label: 'تم الشحن' },
    { value: 'DELIVERED', label: 'تم التوصيل' },
    { value: 'CANCELLED', label: 'ملغي' },
  ],
  sortBy: [
    { value: 'newest', label: 'الأحدث' },
    { value: 'oldest', label: 'الأقدم' },
    { value: 'name', label: 'الاسم' },
  ],
};
