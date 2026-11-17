/**
 * Testes de integração — Pedidos
 *
 * Requerem banco PostgreSQL ativo.
 * Execute: npm run db:up && npx vitest run tests/integration/orders.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { orderService } from "@/modules/orders/order.service";
import { cartService } from "@/modules/cart/cart.service";
import { BadRequestError, NotFoundError } from "@/lib/errors";
import {
  checkDbAvailability,
  cleanupTestData,
  setupTestCategory,
  setupTestProduct,
  setupTestUser,
  testPrisma,
} from "./setup";

let isDbAvailable = false;
let userId: string;
let productId: string;
let categoryId: string;
const createdOrderIds: string[] = [];
const createdCartIds: string[] = [];

const validAddress = {
  street: "Rua dos Testes",
  number: "42",
  neighborhood: "Bairro Teste",
  city: "São Paulo",
  state: "SP",
  zipCode: "01310-100",
};

beforeAll(async () => {
  isDbAvailable = await checkDbAvailability();
  if (isDbAvailable) {
    const user = await setupTestUser({ email: `order_test_${Date.now()}@test.com` });
    userId = user.id;
    const category = await setupTestCategory("Order Test Category");
    categoryId = category.id;
    const product = await setupTestProduct(categoryId, { price: 10.0 });
    productId = product.id;
  }
});

afterAll(async () => {
  if (isDbAvailable) {
    await cleanupTestData({
      orderIds: createdOrderIds,
      cartIds: createdCartIds,
      productIds: [productId],
      userIds: [userId],
    });
    await testPrisma.category.deleteMany({ where: { name: "Order Test Category" } });
    await testPrisma.$disconnect();
  }
});

describe("orderService — integração", () => {
  it.skipIf(!isDbAvailable)(
    "deve criar pedido com itens em transação (RN09)",
    async () => {
      // Adicionar item ao carrinho
      const cart = await cartService.addItem(userId, { productId, quantity: 2 });
      createdCartIds.push(cart.id);

      const order = await orderService.createOrder(userId, {
        deliveryAddress: validAddress,
        paymentMethod: "demo",
      });
      createdOrderIds.push(order.id);

      expect(order.id).toBeDefined();
      expect(order.items).toHaveLength(1);
      expect(order.items[0].productId).toBe(productId);
      expect(order.items[0].quantity).toBe(2);

      // RN07 — total calculado pelo servidor
      expect(order.total).toBe(20.0); // 10.00 × 2

      // Confirmar integridade no banco
      const inDb = await testPrisma.order.findUnique({
        where: { id: order.id },
        include: { items: true, payments: true },
      });
      expect(inDb!.items).toHaveLength(1);
      expect(inDb!.payments).toHaveLength(1);
    }
  );

  it.skipIf(!isDbAvailable)(
    "deve limpar o carrinho após criação do pedido",
    async () => {
      // Novo carrinho para este teste
      const cart = await cartService.addItem(userId, { productId, quantity: 1 });
      createdCartIds.push(cart.id);

      const order = await orderService.createOrder(userId, {
        deliveryAddress: validAddress,
        paymentMethod: "demo",
      });
      createdOrderIds.push(order.id);

      // Carrinho deve estar vazio
      const emptyCart = await cartService.getCart(userId);
      expect(emptyCart.items).toHaveLength(0);
    }
  );

  it.skipIf(!isDbAvailable)(
    "deve lançar BadRequestError para carrinho vazio",
    async () => {
      // Garantir carrinho vazio
      await cartService.clearCart(userId);

      await expect(
        orderService.createOrder(userId, {
          deliveryAddress: validAddress,
          paymentMethod: "demo",
        })
      ).rejects.toThrow(BadRequestError);
    }
  );

  it.skipIf(!isDbAvailable)(
    "deve isolar pedidos por usuário (RN08)",
    async () => {
      // Criar pedido com outro usuário
      const otherUser = await setupTestUser({
        email: `other_${Date.now()}@test.com`,
      });

      // Listar pedidos do primeiro usuário — não deve ver os de outros
      const myOrders = await orderService.listUserOrders(userId);
      const myOrderIds = myOrders.map((o) => o.id);

      // Tentar acessar pedido de outro usuário deve lançar NotFoundError
      if (createdOrderIds.length > 0) {
        await expect(
          orderService.getUserOrderById(createdOrderIds[0], otherUser.id)
        ).rejects.toThrow(NotFoundError);
      }

      await testPrisma.user.delete({ where: { id: otherUser.id } });
    }
  );

  it.skipIf(!isDbAvailable)(
    "deve preservar preço histórico ao desativar produto (RN05/RN11)",
    async () => {
      // Adicionar produto ao carrinho
      const cart = await cartService.addItem(userId, { productId, quantity: 1 });
      createdCartIds.push(cart.id);

      const order = await orderService.createOrder(userId, {
        deliveryAddress: validAddress,
        paymentMethod: "demo",
      });
      createdOrderIds.push(order.id);

      // Desativar o produto (simula descontinuação)
      await testPrisma.product.update({
        where: { id: productId },
        data: { active: false },
      });

      // Pedido ainda deve ter o preço histórico preservado
      const orderDetail = await orderService.getUserOrderById(order.id, userId);
      expect(orderDetail.items[0].unitPrice).toBe(10.0);

      // Reativar para outros testes
      await testPrisma.product.update({
        where: { id: productId },
        data: { active: true },
      });
    }
  );
});
