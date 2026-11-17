import { prisma } from "@/lib/prisma";
import type { ProductFilters } from "./product.validations";
import type { CreateProductInput, UpdateProductInput } from "./product.validations";

export const productRepository = {
  async findMany(filters: ProductFilters) {
    const { search, categoryId, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where = {
      active: true,
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  async findManyAdmin(filters: Omit<ProductFilters, "page" | "limit"> & { page: number; limit: number }) {
    const { search, categoryId, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where = {
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
  },

  async findActiveById(id: string) {
    return prisma.product.findFirst({
      where: { id, active: true },
      include: { category: { select: { id: true, name: true } } },
    });
  },

  async create(data: CreateProductInput) {
    return prisma.product.create({
      data,
      include: { category: { select: { id: true, name: true } } },
    });
  },

  async update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true } } },
    });
  },

  async deactivate(id: string) {
    return prisma.product.update({
      where: { id },
      data: { active: false },
    });
  },

  async findAllCategories() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  },
};
