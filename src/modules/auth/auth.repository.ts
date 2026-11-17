import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

export const authRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }) {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true, role: true },
    });
  },

  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({ where: { email } });
    return count > 0;
  },
};
