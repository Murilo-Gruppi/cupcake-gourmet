import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

const orderInclude = {
  items: true,
  payments: { orderBy: { createdAt: "desc" as const } },
};

export const orderRepository = {
  async findByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  async findByIdAndUserId(id: string, userId: string) {
    return prisma.order.findFirst({
      where: { id, userId },
      include: orderInclude,
    });
  },

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: orderInclude,
    });
  },

  async findAll(filters?: { status?: OrderStatus; page?: number; limit?: number }) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = filters?.status ? { status: filters.status } : {};

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { ...orderInclude, user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { items, total, page, limit };
  },

  async createWithItems(data: {
    userId: string;
    total: number;
    deliveryAddress: Prisma.InputJsonValue;
    items: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }>;
  }) {
    // RN09 — criação do pedido e itens em transação
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: data.userId,
          total: data.total,
          deliveryAddress: data.deliveryAddress,
          items: {
            create: data.items,
          },
        },
        include: orderInclude,
      });
      return order;
    });
  },

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status } });
  },

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return prisma.order.update({ where: { id }, data: { paymentStatus } });
  },

  // Contagens para o dashboard
  async countByStatus() {
    return prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
  },

  async sumRevenueToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: today },
      },
      _sum: { total: true },
    });
    return result._sum.total ?? 0;
  },

  async sumRevenueMonth() {
    const firstDay = new Date();
    firstDay.setDate(1);
    firstDay.setHours(0, 0, 0, 0);
    const result = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: firstDay },
      },
      _sum: { total: true },
    });
    return result._sum.total ?? 0;
  },
};
