export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryId: string;
  categoryName: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: string;
  active?: boolean;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}
