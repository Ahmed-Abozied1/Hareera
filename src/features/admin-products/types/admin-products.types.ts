export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number | null;
  category: "PAJAMAS" | "ROBES";
  sizes: string[];
  colors: string[];
  images: string[];
  imageUrl: string | null;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
