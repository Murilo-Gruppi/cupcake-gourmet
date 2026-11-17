import { orderRepository } from "./order.repository";
import { cartRepository } from "@/modules/cart/cart.repository";
import { productRepository } from "@/modules/products/product.repository";
import { paymentService } from "@/modules/payments/payment.service";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validations";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/lib/errors";
import { decimalToNumber } from "@/lib/utils/format";
import type { CreateOrderInput, UpdateOrderStatusInput } from "./order.validations";
import type { DeliveryAddress } from "@/types/order";

function toOrderDTO(order: {
  id: string;
  userId: string;
  total: { toString(): string } | number;
  status: string;
  paymentStatus: string;
  deliveryAddress: unknown;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: { toString(): string } | number;
    subtotal: { toString(): string } | number;
  }>;
}) {
  return {
    id: order.id,
    userId: order.userId,
    total: decimalToNumber(order.total),
    status: order.status,
    paymentStatus: order.paymentStatus,
    deliveryAddress: order.deliveryAddress as DeliveryAddress,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: decimalToNumber(item.unitPrice),
      subtotal: decimalToNumber(item.subtotal),
    })),
  };
}

export const orderService = {
  async createOrder(userId: string, input: CreateOrderInput) {
    // Validar input
    const parsed = createOrderSchema.safeParse(input);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ValidationError("Dados do pedido inválidos.", fields);
    }

    // RN01 — somente clientes autenticados (garantido pelo middleware)

    // Buscar carrinho do usuário
    const cart = await cartRepository.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Carrinho vazio. Adicione produtos antes de finalizar o pedido.");
    }

    // RN04 e RN05 — consultar preços atuais no banco (nunca confiar no cliente)
    const orderItems = await Promise.all(
      cart.items.map(async (cartItem) => {
        const product = await productRepository.findActiveById(cartItem.productId);

        // RN03 — produto deve estar ativo
        if (!product) {
          throw new BadRequestError(
            `O produto "${cartItem.product.name}" não está mais disponível.`
          );
        }

        const unitPrice = decimalToNumber(product.price);
        const subtotal = unitPrice * cartItem.quantity;

        return {
          productId: product.id,
          productName: product.name, // RN05 — snapshot do nome
          quantity: cartItem.quantity,
          unitPrice,                  // RN05 — snapshot do preço
          subtotal,
        };
      })
    );

    // RN06 — pedido deve ter pelo menos um item
    if (orderItems.length === 0) {
      throw new BadRequestError("O pedido deve conter pelo menos um produto.");
    }

    // RN07 — total calculado pelo servidor
    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    // RN09 — criação do pedido e itens em transação (via repository)
    const order = await orderRepository.createWithItems({
      userId,
      total,
      deliveryAddress: parsed.data.deliveryAddress,
      items: orderItems,
    });

    // Processar pagamento
    const { result } = await paymentService.processPayment(
      order.id,
      total,
      parsed.data.paymentMethod
    );

    // Atualizar status do pagamento no pedido
    await orderRepository.updatePaymentStatus(
      order.id,
      result.status as "PAID" | "FAILED" | "PROCESSING"
    );

    // Limpar o carrinho após finalizar o pedido
    await cartRepository.clearCart(cart.id);

    // Buscar pedido atualizado
    const updatedOrder = await orderRepository.findById(order.id);
    return toOrderDTO(updatedOrder!);
  },

  async listUserOrders(userId: string) {
    const orders = await orderRepository.findByUserId(userId);
    return orders.map(toOrderDTO);
  },

  // RN08 — cliente só acessa seus próprios pedidos
  async getUserOrderById(orderId: string, userId: string) {
    const order = await orderRepository.findByIdAndUserId(orderId, userId);
    if (!order) throw new NotFoundError("Pedido");
    return toOrderDTO(order);
  },

  // Admin
  async listAllOrders(filters?: { status?: string; page?: number; limit?: number }) {
    const result = await orderRepository.findAll(filters as Parameters<typeof orderRepository.findAll>[0]);
    return {
      ...result,
      items: result.items.map(toOrderDTO),
      totalPages: Math.ceil(result.total / (filters?.limit ?? 20)),
    };
  },

  async getOrderById(orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError("Pedido");
    return toOrderDTO(order);
  },

  // RN02 — apenas admins atualizam status
  async updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
    const parsed = updateOrderStatusSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("Status inválido.");
    }

    const existing = await orderRepository.findById(orderId);
    if (!existing) throw new NotFoundError("Pedido");

    const updated = await orderRepository.updateStatus(orderId, parsed.data.status);
    return updated;
  },

  async getDashboardStats() {
    const [countByStatus, revenueToday, revenueMonth] = await Promise.all([
      orderRepository.countByStatus(),
      orderRepository.sumRevenueToday(),
      orderRepository.sumRevenueMonth(),
    ]);

    const statusMap = Object.fromEntries(
      countByStatus.map((s) => [s.status, s._count._all])
    );

    return {
      revenueToday: decimalToNumber(revenueToday),
      revenueMonth: decimalToNumber(revenueMonth),
      ordersByStatus: statusMap,
      totalOrders: countByStatus.reduce((sum, s) => sum + s._count._all, 0),
    };
  },
};
