// src/app/components/services/search/SearchService.tsx

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  stock: number;
  discount: number;
  flavors: string[];
  sizes: string[];
  currentImageIndex: number;
  imageUrls: string[];
  dateAdded?: Date;
  brand?: string;
  category?: string;
}
