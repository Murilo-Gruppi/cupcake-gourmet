import { OrderStatus, PaymentStatus } from "@prisma/client";

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OrderItemDTO {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDTO {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: DeliveryAddress;
  items: OrderItemDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}
