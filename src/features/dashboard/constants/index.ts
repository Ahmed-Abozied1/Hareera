import { OrderStatus } from "@/features/orders/types/orders.types";

export const ITEMS_PER_PAGE = 10;

export const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-warning/10 text-warning',
  CONFIRMED: 'bg-info/10 text-info',
  SHIPPED: 'bg-primary/10 text-primary',
  DELIVERED: 'bg-success/10 text-success',
  CANCELLED: 'bg-error/10 text-error',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'قيد المراجعة',
  CONFIRMED: 'تم التأكيد',
  SHIPPED: 'تم الشحن',
  DELIVERED: 'تم التوصيل',
  CANCELLED: 'ملغي',
};

export const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'الكل' },
  { value: 'PENDING', label: STATUS_LABELS.PENDING },
  { value: 'CONFIRMED', label: STATUS_LABELS.CONFIRMED },
  { value: 'SHIPPED', label: STATUS_LABELS.SHIPPED },
  { value: 'DELIVERED', label: STATUS_LABELS.DELIVERED },
  { value: 'CANCELLED', label: STATUS_LABELS.CANCELLED },
];

export const EDIT_STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: 'PENDING', label: STATUS_LABELS.PENDING },
  { value: 'CONFIRMED', label: STATUS_LABELS.CONFIRMED },
  { value: 'SHIPPED', label: STATUS_LABELS.SHIPPED },
  { value: 'DELIVERED', label: STATUS_LABELS.DELIVERED },
  { value: 'CANCELLED', label: STATUS_LABELS.CANCELLED },
];
