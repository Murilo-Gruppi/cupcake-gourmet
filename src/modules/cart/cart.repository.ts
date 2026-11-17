import { prisma } from "@/lib/prisma";

export const cartRepository = {
  async findByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                active: true,
              },
            },
          },
        },
      },
    });
  },

  async findOrCreate(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                active: true,
              },
            },
          },
        },
      },
    });
  },

  async findItemById(itemId: string) {
    return prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
  },

  async findItemByProductId(cartId: string, productId: string) {
    return prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });
  },

  async addItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      create: { cartId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });
  },

  async updateItemQuantity(itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  },

  async removeItem(itemId: string) {
    return prisma.cartItem.delete({ where: { id: itemId } });
  },

  async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  },

  async updateTimestamp(cartId: string) {
    return prisma.cart.update({
      where: { id: cartId },
      data: { updatedAt: new Date() },
    });
  },
};
