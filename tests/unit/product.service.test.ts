import { describe, it, expect, vi, beforeEach } from "vitest";
import { productService } from "@/modules/products/product.service";
import { productRepository } from "@/modules/products/product.repository";
import { NotFoundError, ValidationError } from "@/lib/errors";

vi.mock("@/modules/products/product.repository");

// IDs no formato CUID válido
const PRODUCT_ID = "cjld2cjxh0000qzrmn831i7rn";
const CATEGORY_ID = "cjld2cjxh0004qzrmn831i7rs";

const mockCategory = { id: CATEGORY_ID, name: "Clássicos" };

const mockProduct = {
  id: PRODUCT_ID,
  name: "Chocolate Belga",
  description: "Descrição do produto com pelo menos 10 chars",
  price: { toString: () => "12.90" },
  imageUrl: "https://example.com/img.jpg",
  categoryId: CATEGORY_ID,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: mockCategory,
};

describe("productService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductById", () => {
    it("deve retornar produto existente como DTO", async () => {
      vi.mocked(productRepository.findById).mockResolvedValue(mockProduct as never);

      const product = await productService.getProductById(PRODUCT_ID);

      expect(product.id).toBe(PRODUCT_ID);
      expect(product.price).toBe(12.9);
      expect(product.categoryName).toBe("Clássicos");
    });

    it("deve lançar NotFoundError para produto inexistente", async () => {
      vi.mocked(productRepository.findById).mockResolvedValue(null);

      await expect(productService.getProductById(PRODUCT_ID)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("createProduct", () => {
    it("deve criar produto com dados válidos", async () => {
      vi.mocked(productRepository.create).mockResolvedValue(mockProduct as never);

      const product = await productService.createProduct({
        name: "Novo Cupcake",
        description: "Descrição com mais de dez caracteres",
        price: 15.9,
        categoryId: CATEGORY_ID,
      });

      expect(product.id).toBe(PRODUCT_ID);
      expect(productRepository.create).toHaveBeenCalledOnce();
    });

    it("deve lançar ValidationError para preço negativo", async () => {
      await expect(
        productService.createProduct({
          name: "Cupcake",
          description: "Descrição válida com mais de dez chars",
          price: -5,
          categoryId: CATEGORY_ID,
        })
      ).rejects.toThrow(ValidationError);
    });

    it("deve lançar ValidationError para preço zero", async () => {
      await expect(
        productService.createProduct({
          name: "Cupcake",
          description: "Descrição válida com mais de dez chars",
          price: 0,
          categoryId: CATEGORY_ID,
        })
      ).rejects.toThrow(ValidationError);
    });

    it("deve lançar ValidationError para nome muito curto", async () => {
      await expect(
        productService.createProduct({
          name: "A",
          description: "Descrição válida com mais de dez chars",
          price: 10,
          categoryId: CATEGORY_ID,
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("deactivateProduct", () => {
    it("deve desativar produto sem excluí-lo (RN11)", async () => {
      vi.mocked(productRepository.findById).mockResolvedValue(mockProduct as never);
      vi.mocked(productRepository.deactivate).mockResolvedValue({
        ...mockProduct,
        active: false,
      } as never);

      await productService.deactivateProduct(PRODUCT_ID);

      expect(productRepository.deactivate).toHaveBeenCalledWith(PRODUCT_ID);
    });

    it("deve lançar NotFoundError para produto inexistente", async () => {
      vi.mocked(productRepository.findById).mockResolvedValue(null);

      await expect(
        productService.deactivateProduct(PRODUCT_ID)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
