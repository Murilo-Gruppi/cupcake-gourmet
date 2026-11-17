import { describe, it, expect, vi, beforeEach } from "vitest";
import { orderService } from "@/modules/orders/order.service";
import { orderRepository } from "@/modules/orders/order.repository";
import { cartRepository } from "@/modules/cart/cart.repository";
import { productRepository } from "@/modules/products/product.repository";
import { paymentService } from "@/modules/payments/payment.service";
import { BadRequestError, NotFoundError } from "@/lib/errors";

vi.mock("@/modules/orders/order.repository");
vi.mock("@/modules/cart/cart.repository");
vi.mock("@/modules/products/product.repository");
vi.mock("@/modules/payments/payment.service");

// IDs no formato CUID válido
const PRODUCT_ID = "cjld2cjxh0000qzrmn831i7rn";
const CART_ID   = "cjld2cjxh0001qzrmn831i7rp";
const USER_ID   = "cjld2cjxh0002qzrmn831i7rq";
const ORDER_ID  = "cjld2cjxh0006qzrmn831i7ru";
const CATEGORY_ID = "cjld2cjxh0004qzrmn831i7rs";

const mockProduct = {
  id: PRODUCT_ID,
  name: "Chocolate Belga",
  description: "desc",
  price: { toString: () => "12.90" },
  imageUrl: null,
  categoryId: CATEGORY_ID,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: { id: CATEGORY_ID, name: "Clássicos" },
};

const mockCart = {
  id: CART_ID,
  userId: USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: "cjld2cjxh0007qzrmn831i7rv",
      cartId: CART_ID,
      productId: PRODUCT_ID,
      quantity: 2,
      product: {
        id: PRODUCT_ID,
        name: "Chocolate Belga",
        price: { toString: () => "12.90" },
        imageUrl: null,
        active: true,
      },
    },
  ],
};

const mockOrder = {
  id: ORDER_ID,
  userId: USER_ID,
  total: { toString: () => "25.80" },
  status: "PENDING",
  paymentStatus: "PAID",
  deliveryAddress: {
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: "cjld2cjxh0008qzrmn831i7rw",
      orderId: ORDER_ID,
      productId: PRODUCT_ID,
      productName: "Chocolate Belga",
      quantity: 2,
      unitPrice: { toString: () => "12.90" },
      subtotal: { toString: () => "25.80" },
    },
  ],
  payments: [],
};

const validDeliveryAddress = {
  street: "Rua das Flores",
  number: "123",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01310-100",
};

describe("orderService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrder", () => {
    it("deve criar pedido com total calculado pelo servidor (RN07)", async () => {
      vi.mocked(cartRepository.findByUserId).mockResolvedValue(mockCart as never);
      vi.mocked(productRepository.findActiveById).mockResolvedValue(
        mockProduct as never
      );
      vi.mocked(orderRepository.createWithItems).mockResolvedValue(
        mockOrder as never
      );
      vi.mocked(paymentService.processPayment).mockResolvedValue({
        payment: {} as never,
        result: { status: "PAID", provider: "demo", externalReference: "DEMO-123" },
      });
      vi.mocked(orderRepository.updatePaymentStatus).mockResolvedValue(
        mockOrder as never
      );
      vi.mocked(cartRepository.clearCart).mockResolvedValue({} as never);
      vi.mocked(orderRepository.findById).mockResolvedValue(mockOrder as never);

      const order = await orderService.createOrder(USER_ID, {
        deliveryAddress: validDeliveryAddress,
        paymentMethod: "demo",
      });

      expect(order.id).toBe(ORDER_ID);

      // RN07 — total calculado pelo servidor (12.90 * 2 = 25.80)
      expect(orderRepository.createWithItems).toHaveBeenCalledWith(
        expect.objectContaining({ total: 25.8 })
      );
    });

    it("deve lançar BadRequestError quando carrinho está vazio", async () => {
      vi.mocked(cartRepository.findByUserId).mockResolvedValue({
        ...mockCart,
        items: [],
      } as never);

      await expect(
        orderService.createOrder(USER_ID, {
          deliveryAddress: validDeliveryAddress,
          paymentMethod: "demo",
        })
      ).rejects.toThrow(BadRequestError);
    });

    it("deve lançar BadRequestError quando produto não está mais disponível (RN03)", async () => {
      vi.mocked(cartRepository.findByUserId).mockResolvedValue(mockCart as never);
      vi.mocked(productRepository.findActiveById).mockResolvedValue(null);

      await expect(
        orderService.createOrder(USER_ID, {
          deliveryAddress: validDeliveryAddress,
          paymentMethod: "demo",
        })
      ).rejects.toThrow(BadRequestError);
    });

    it("deve limpar o carrinho após criação do pedido", async () => {
      vi.mocked(cartRepository.findByUserId).mockResolvedValue(mockCart as never);
      vi.mocked(productRepository.findActiveById).mockResolvedValue(
        mockProduct as never
      );
      vi.mocked(orderRepository.createWithItems).mockResolvedValue(
        mockOrder as never
      );
      vi.mocked(paymentService.processPayment).mockResolvedValue({
        payment: {} as never,
        result: { status: "PAID", provider: "demo", externalReference: "DEMO-123" },
      });
      vi.mocked(orderRepository.updatePaymentStatus).mockResolvedValue(
        mockOrder as never
      );
      vi.mocked(cartRepository.clearCart).mockResolvedValue({} as never);
      vi.mocked(orderRepository.findById).mockResolvedValue(mockOrder as never);

      await orderService.createOrder(USER_ID, {
        deliveryAddress: validDeliveryAddress,
        paymentMethod: "demo",
      });

      expect(cartRepository.clearCart).toHaveBeenCalledWith(CART_ID);
    });

    it("deve usar preços do banco, não do carrinho (RN04/RN05)", async () => {
      vi.mocked(cartRepository.findByUserId).mockResolvedValue(mockCart as never);
      // Produto com preço diferente do mock do carrinho (simula mudança de preço)
      vi.mocked(productRepository.findActiveById).mockResolvedValue({
        ...mockProduct,
        price: { toString: () => "15.00" }, // preço atualizado
      } as never);
      vi.mocked(orderRepository.createWithItems).mockResolvedValue(
        mockOrder as never
      );
      vi.mocked(paymentService.processPayment).mockResolvedValue({
        payment: {} as never,
        result: { status: "PAID", provider: "demo", externalReference: "DEMO-123" },
      });
      vi.mocked(orderRepository.updatePaymentStatus).mockResolvedValue(
        mockOrder as never
      );
      vi.mocked(cartRepository.clearCart).mockResolvedValue({} as never);
      vi.mocked(orderRepository.findById).mockResolvedValue(mockOrder as never);

      await orderService.createOrder(USER_ID, {
        deliveryAddress: validDeliveryAddress,
        paymentMethod: "demo",
      });

      // Deve usar preço atual do banco (15.00 * 2 = 30.00)
      expect(orderRepository.createWithItems).toHaveBeenCalledWith(
        expect.objectContaining({ total: 30.0 })
      );
    });
  });

  describe("getUserOrderById", () => {
    it("deve retornar pedido do próprio usuário", async () => {
      vi.mocked(orderRepository.findByIdAndUserId).mockResolvedValue(
        mockOrder as never
      );

      const order = await orderService.getUserOrderById(ORDER_ID, USER_ID);
      expect(order.id).toBe(ORDER_ID);
    });

    it("deve lançar NotFoundError para pedido de outro usuário (RN08)", async () => {
      vi.mocked(orderRepository.findByIdAndUserId).mockResolvedValue(null);

      await expect(
        orderService.getUserOrderById(ORDER_ID, "outro-user-id")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateOrderStatus", () => {
    it("deve atualizar status do pedido com sucesso", async () => {
      vi.mocked(orderRepository.findById).mockResolvedValue(mockOrder as never);
      vi.mocked(orderRepository.updateStatus).mockResolvedValue({
        ...mockOrder,
        status: "CONFIRMED",
      } as never);

      await orderService.updateOrderStatus(ORDER_ID, { status: "CONFIRMED" });

      expect(orderRepository.updateStatus).toHaveBeenCalledWith(
        ORDER_ID,
        "CONFIRMED"
      );
    });

    it("deve lançar NotFoundError para pedido inexistente", async () => {
      vi.mocked(orderRepository.findById).mockResolvedValue(null);

      await expect(
        orderService.updateOrderStatus(ORDER_ID, { status: "CONFIRMED" })
      ).rejects.toThrow(NotFoundError);
    });
  });
});
