/**
 * Setup para testes de integração.
 *
 * Os testes de integração requerem um banco PostgreSQL real.
 * Execute com o banco ativo:
 *
 *   npm run db:up && npx vitest run tests/integration
 *
 * Sem banco disponível, os testes são pulados automaticamente.
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

let _testPrisma: PrismaClient | null = null;

function getTestPrisma(): PrismaClient {
  if (!_testPrisma) {
    _testPrisma = new PrismaClient({ log: ["error"] });
  }
  return _testPrisma;
}

// Lazy accessor — não instancia até ser usado
export const testPrisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getTestPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export let dbAvailable = false;

export async function checkDbAvailability(): Promise<boolean> {
  try {
    const client = getTestPrisma();
    await client.$connect();
    await client.$queryRaw`SELECT 1`;
    dbAvailable = true;
    return true;
  } catch {
    return false;
  }
}

export async function setupTestUser(overrides?: {
  name?: string;
  email?: string;
  password?: string;
  role?: "CUSTOMER" | "ADMIN";
}) {
  const data = {
    name: overrides?.name ?? "Test User",
    email: overrides?.email ?? `test_${Date.now()}@test.com`,
    passwordHash: await hash(overrides?.password ?? "Test@123456", 12),
    role: overrides?.role ?? ("CUSTOMER" as const),
  };
  return testPrisma.user.create({ data });
}

export async function setupTestCategory(name?: string) {
  return testPrisma.category.upsert({
    where: { name: name ?? "Test Category" },
    create: { name: name ?? "Test Category", description: "Categoria de teste" },
    update: {},
  });
}

export async function setupTestProduct(categoryId: string, overrides?: {
  name?: string;
  price?: number;
  active?: boolean;
}) {
  return testPrisma.product.create({
    data: {
      name: overrides?.name ?? `Test Cupcake ${Date.now()}`,
      description: "Descrição de teste com pelo menos dez caracteres",
      price: overrides?.price ?? 12.9,
      categoryId,
      active: overrides?.active ?? true,
    },
    include: { category: true },
  });
}

export async function cleanupTestData(ids: {
  userIds?: string[];
  productIds?: string[];
  orderIds?: string[];
  cartIds?: string[];
}) {
  if (ids.orderIds?.length) {
    await testPrisma.payment.deleteMany({ where: { orderId: { in: ids.orderIds } } });
    await testPrisma.orderItem.deleteMany({ where: { orderId: { in: ids.orderIds } } });
    await testPrisma.order.deleteMany({ where: { id: { in: ids.orderIds } } });
  }
  if (ids.cartIds?.length) {
    await testPrisma.cartItem.deleteMany({ where: { cartId: { in: ids.cartIds } } });
    await testPrisma.cart.deleteMany({ where: { id: { in: ids.cartIds } } });
  }
  if (ids.productIds?.length) {
    await testPrisma.product.deleteMany({ where: { id: { in: ids.productIds } } });
  }
  if (ids.userIds?.length) {
    await testPrisma.user.deleteMany({ where: { id: { in: ids.userIds } } });
  }
}
