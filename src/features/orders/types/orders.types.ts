export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderUser {
  name: string;
  email: string;
  phone: string | null;
}

export interface OrderProduct {
  name: string;
  imageUrl: string | null;
  category?: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  userId: string;
  productId: string;
  status: OrderStatus;
  totalPrice: number;
  shippingCost: number;
  quantity: number;
  size: string;
  color: string;
  isArchived: boolean;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string | null;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  product: OrderProduct;
  user: OrderUser;
}

export interface OrdersFilters {
  searchTerm: string;
  status: string;
  sortBy: string;
}

export interface OrderUpdatePayload {
  status?: OrderStatus;
}

export interface OrdersState {
  orders: Order[];
  filteredOrders: Order[];
  isLoading: boolean;
  selectedRows: string[];
  currentPage: number;
  expandedRow: string | null;
}

export interface OrdersActions {
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, payload: OrderUpdatePayload) => Promise<boolean>;
  selectAll: (checked: boolean) => void;
  selectRow: (id: string, checked: boolean) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setExpandedRow: (id: string | null) => void;
  updateFilter: <K extends keyof OrdersFilters>(key: K, value: OrdersFilters[K]) => void;
}

export interface OrdersHookReturn extends OrdersState, OrdersActions {
  totalPages: number;
  paginatedOrders: Order[];
  filters: OrdersFilters;
}

export interface ExportDataRow {
  'رقم الطلب': number;
  'العميل': string;
  'رقم الهاتف': string;
  'المنتج': string;
  'المقاس': string;
  'اللون': string;
  'الكمية': number;
  'المحافظة': string;
  'العنوان': string;
  'السعر': number;
  'الحالة': string;
  'تاريخ الطلب': string;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  totalPages: number;
  page: number;
}
