import { prisma } from "@/lib/prisma";
import type { PaymentStatus } from "@prisma/client";

export const paymentRepository = {
  async create(data: {
    orderId: string;
    provider: string;
    externalReference?: string;
    amount: number;
    status: PaymentStatus;
  }) {
    return prisma.payment.create({ data });
  },

  async findByOrderId(orderId: string) {
    return prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateStatus(id: string, status: PaymentStatus) {
    return prisma.payment.update({ where: { id }, data: { status } });
  },
};
