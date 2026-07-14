export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  imageUrl?: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: number;
  productId: string;
  userId?: string;
  status: string;
  totalPrice: number;
  size: string;
  color: string;
  quantity: number;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  guestName?: string | null;
  guestImage?: string | null;
  userId?: string | null;
  productId: string;
  user?: {
    name: string;
    email?: string;
    image: string | null;
  } | null;
}

export interface CreateOrderPayload {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
}

export interface PhoneObject {
  country: string;
  number: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  imageUrl: string | null;
  images: string[];
  rating: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: Date;
  updatedAt: Date;
  reviews: Review[];
  averageRating: number;
  reviewsCount: number;
}
