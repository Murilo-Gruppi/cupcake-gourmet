import { productRepository } from "./product.repository";
import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
} from "./product.validations";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { decimalToNumber } from "@/lib/utils/format";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from "./product.validations";

function toDTO(product: {
  id: string;
  name: string;
  description: string;
  price: { toString(): string } | number;
  imageUrl: string | null;
  categoryId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string };
}) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: decimalToNumber(product.price),
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    active: product.active,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export const productService = {
  async listProducts(rawFilters: Partial<ProductFilters>) {
    const filters = productFiltersSchema.parse(rawFilters);
    const result = await productRepository.findMany(filters);
    return {
      ...result,
      items: result.items.map(toDTO),
      totalPages: Math.ceil(result.total / filters.limit),
    };
  },

  async listProductsAdmin(rawFilters: Partial<ProductFilters>) {
    const filters = productFiltersSchema.parse(rawFilters);
    const result = await productRepository.findManyAdmin(filters);
    return {
      ...result,
      items: result.items.map(toDTO),
      totalPages: Math.ceil(result.total / filters.limit),
    };
  },

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError("Produto");
    return toDTO(product);
  },

  async getActiveProductById(id: string) {
    const product = await productRepository.findActiveById(id);
    if (!product) throw new NotFoundError("Produto");
    return toDTO(product);
  },

  async createProduct(input: CreateProductInput) {
    const parsed = createProductSchema.safeParse(input);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ValidationError("Dados do produto inválidos.", fields);
    }
    const product = await productRepository.create(parsed.data);
    return toDTO(product);
  },

  async updateProduct(id: string, input: UpdateProductInput) {
    const parsed = updateProductSchema.safeParse(input);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ValidationError("Dados do produto inválidos.", fields);
    }

    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError("Produto");

    const product = await productRepository.update(id, parsed.data);
    return toDTO(product);
  },

  async deactivateProduct(id: string) {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError("Produto");
    await productRepository.deactivate(id);
  },

  async listCategories() {
    return productRepository.findAllCategories();
  },
};
