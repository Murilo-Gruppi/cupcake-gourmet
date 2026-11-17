export interface CartItemDTO {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImageUrl: string | null;
  quantity: number;
  subtotal: number;
}

export interface CartDTO {
  id: string;
  items: CartItemDTO[];
  total: number;
  itemCount: number;
}

// Estado do carrinho local (Zustand) para usuários não autenticados
export interface LocalCartItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImageUrl: string | null;
  quantity: number;
}

export interface LocalCart {
  items: LocalCartItem[];
}
