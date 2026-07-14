export interface FAQType {
  id: string;
  question: string;
  answer: string;
}
export interface TestimonialUser {
  name: string | null;
  image: string | null;
}

export interface Testimonial {
  id: string;
  rating: number;
  comment: string;
  name?: string | null;
  image?: string | null;
  user?: TestimonialUser;
}

export interface TestimonialCardProps {
  rating: number
  comment: string
  name?: string | null
  image?: string | null
  user?: {
    name: string | null
    image?: string | null
  }
}

export interface Stat {
  label: string;
  value: string;
}

export interface Product {
  id: string
  slug?: string | null
  name: string
  description?: string
  price: number
  comparePrice?: number | null
  imageUrl?: string
  category: string
  sizes?: string[]
  colors?: string[]
  rating: number
  reviewsCount: number
  stock?: number
  isNew?: boolean
  isFeatured?: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductCardProps {
  id: string;
  slug?: string | null;
  name: string;
  category?: string;
  price: number;
  comparePrice?: number | null;
  rating?: number;
  imageUrl?: string;
}