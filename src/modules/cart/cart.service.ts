import { cartRepository } from "./cart.repository";
import { addCartItemSchema, updateCartItemSchema } from "./cart.validations";
import { productRepository } from "@/modules/products/product.repository";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  ValidationError,
} from "@/lib/errors";
import { decimalToNumber } from "@/lib/utils/format";
import type { AddCartItemInput, UpdateCartItemInput } from "./cart.validations";

function buildCartDTO(cart: {
  id: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: { toString(): string } | number;
      imageUrl: string | null;
      active: boolean;
    };
  }>;
}) {
  const items = cart.items.map((item) => {
    const price = decimalToNumber(item.product.price);
    return {
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productPrice: price,
      productImageUrl: item.product.imageUrl,
      quantity: item.quantity,
      subtotal: price * item.quantity,
    };
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { id: cart.id, items, total, itemCount };
}

export const cartService = {
  async getCart(userId: string) {
    const cart = await cartRepository.findOrCreate(userId);
    return buildCartDTO(cart);
  },

  async addItem(userId: string, input: AddCartItemInput) {
    const parsed = addCartItemSchema.safeParse(input);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ValidationError("Dados inválidos.", fields);
    }

    const { productId, quantity } = parsed.data;

    // RN03 — produtos inativos não podem ser adicionados
    const product = await productRepository.findActiveById(productId);
    if (!product) throw new NotFoundError("Produto");
    if (!product.active) {
      throw new BadRequestError("Este produto não está disponível.");
    }

    const cart = await cartRepository.findOrCreate(userId);
    await cartRepository.addItem(cart.id, productId, quantity);
    await cartRepository.updateTimestamp(cart.id);

    const updated = await cartRepository.findByUserId(userId);
    return buildCartDTO(updated!);
  },

  async updateItem(
    userId: string,
    itemId: string,
    input: UpdateCartItemInput
  ) {
    const parsed = updateCartItemSchema.safeParse(input);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ValidationError("Dados inválidos.", fields);
    }

    // Garantir que o item pertence ao carrinho do usuário
    const item = await cartRepository.findItemById(itemId);
    if (!item) throw new NotFoundError("Item do carrinho");
    if (item.cart.userId !== userId) throw new ForbiddenError();

    // RN10 — quantidade mínima 1
    if (parsed.data.quantity < 1) {
      throw new BadRequestError("Quantidade mínima é 1.");
    }

    await cartRepository.updateItemQuantity(itemId, parsed.data.quantity);
    await cartRepository.updateTimestamp(item.cart.id);

    const updated = await cartRepository.findByUserId(userId);
    return buildCartDTO(updated!);
  },

  async removeItem(userId: string, itemId: string) {
    const item = await cartRepository.findItemById(itemId);
    if (!item) throw new NotFoundError("Item do carrinho");
    if (item.cart.userId !== userId) throw new ForbiddenError();

    await cartRepository.removeItem(itemId);
    await cartRepository.updateTimestamp(item.cart.id);

    const updated = await cartRepository.findByUserId(userId);
    return buildCartDTO(updated!);
  },

  async clearCart(userId: string) {
    const cart = await cartRepository.findByUserId(userId);
    if (cart) {
      await cartRepository.clearCart(cart.id);
    }
  },
};
