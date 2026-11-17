/**
 * Testes de integração — Produtos
 *
 * Requerem banco PostgreSQL ativo.
 * Execute: npm run db:up && npx vitest run tests/integration/products.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { productService } from "@/modules/products/product.service";
import { NotFoundError, ValidationError } from "@/lib/errors";
import {
  checkDbAvailability,
  cleanupTestData,
  setupTestCategory,
  testPrisma,
} from "./setup";

let isDbAvailable = false;
let categoryId: string;
const createdProductIds: string[] = [];

beforeAll(async () => {
  isDbAvailable = await checkDbAvailability();
  if (isDbAvailable) {
    const category = await setupTestCategory("Integração Teste");
    categoryId = category.id;
  }
});

afterAll(async () => {
  if (isDbAvailable) {
    await cleanupTestData({ productIds: createdProductIds });
    await testPrisma.category.deleteMany({ where: { name: "Integração Teste" } });
    await testPrisma.$disconnect();
  }
});

describe("productService — integração", () => {
  it.skipIf(!isDbAvailable)("deve criar produto e persistir no banco", async () => {
    const product = await productService.createProduct({
      name: "Cupcake Integração",
      description: "Descrição com pelo menos dez caracteres",
      price: 15.9,
      categoryId,
    });

    createdProductIds.push(product.id);

    expect(product.id).toBeDefined();
    expect(product.price).toBe(15.9);
    expect(product.active).toBe(true);
    expect(product.categoryName).toBe("Integração Teste");
  });

  it.skipIf(!isDbAvailable)(
    "deve listar apenas produtos ativos no catálogo",
    async () => {
      // Criar produto ativo e inativo
      const active = await productService.createProduct({
        name: `Ativo ${Date.now()}`,
        description: "Produto ativo para teste de listagem",
        price: 10,
        categoryId,
      });
      createdProductIds.push(active.id);

      const inativo = await productService.createProduct({
        name: `Inativo ${Date.now()}`,
        description: "Produto inativo para teste de listagem",
        price: 10,
        categoryId,
      });
      createdProductIds.push(inativo.id);
      await productService.deactivateProduct(inativo.id);

      const result = await productService.listProducts({ limit: 50 });

      const ids = result.items.map((p) => p.id);
      expect(ids).toContain(active.id);
      expect(ids).not.toContain(inativo.id);
    }
  );

  it.skipIf(!isDbAvailable)(
    "deve desativar produto sem excluir do banco (RN11)",
    async () => {
      const product = await productService.createProduct({
        name: `Para Desativar ${Date.now()}`,
        description: "Produto para teste de desativação",
        price: 10,
        categoryId,
      });
      createdProductIds.push(product.id);

      await productService.deactivateProduct(product.id);

      // Produto ainda existe no banco
      const inDb = await testPrisma.product.findUnique({ where: { id: product.id } });
      expect(inDb).not.toBeNull();
      expect(inDb!.active).toBe(false);

      // Mas não aparece no catálogo público
      const catalogResult = await productService.listProducts({ limit: 50 });
      expect(catalogResult.items.map((p) => p.id)).not.toContain(product.id);

      // Aparece na listagem admin
      const adminResult = await productService.listProductsAdmin({ limit: 50 });
      expect(adminResult.items.map((p) => p.id)).toContain(product.id);
    }
  );

  it.skipIf(!isDbAvailable)(
    "deve lançar NotFoundError para produto inexistente",
    async () => {
      await expect(
        productService.getProductById("cjld2cjxh9999qzrmn831i999")
      ).rejects.toThrow(NotFoundError);
    }
  );
});
