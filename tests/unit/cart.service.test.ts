import { describe, it, expect, vi, beforeEach } from "vitest";
import { cartService } from "@/modules/cart/cart.service";
import { cartRepository } from "@/modules/cart/cart.repository";
import { productRepository } from "@/modules/products/product.repository";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/lib/errors";

vi.mock("@/modules/cart/cart.repository");
vi.mock("@/modules/products/product.repository");

// IDs no formato CUID válido
const PRODUCT_ID = "cjld2cjxh0000qzrmn831i7rn";
const CART_ID = "cjld2cjxh0001qzrmn831i7rp";
const USER_ID = "cjld2cjxh0002qzrmn831i7rq";
const ITEM_ID = "cjld2cjxh0003qzrmn831i7rr";
const CATEGORY_ID = "cjld2cjxh0004qzrmn831i7rs";
const OTHER_USER_ID = "cjld2cjxh0005qzrmn831i7rt";

const mockProduct = {
  id: PRODUCT_ID,
  name: "Chocolate Belga",
  description: "Descrição",
  price: { toString: () => "12.90" },
  imageUrl: null,
  categoryId: CATEGORY_ID,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: { id: CATEGORY_ID, name: "Clássicos" },
};

const mockCart = {
  id: CART_ID,
  userId: USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [],
};

const mockCartWithItem = {
  ...mockCart,
  items: [
    {
      id: ITEM_ID,
      cartId: CART_ID,
      productId: PRODUCT_ID,
      quantity: 2,
      product: {
        id: PRODUCT_ID,
        name: "Chocolate Belga",
        price: { toString: () => "12.90" },
        imageUrl: null,
        active: true,
      },
    },
  ],
};

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCart", () => {
    it("deve retornar o carrinho do usuário com total calculado", async () => {
      vi.mocked(cartRepository.findOrCreate).mockResolvedValue(
        mockCartWithItem as never
      );

      const cart = await cartService.getCart(USER_ID);

      expect(cart.total).toBeCloseTo(25.8, 2); // 12.90 * 2
      expect(cart.itemCount).toBe(2);
      expect(cart.items).toHaveLength(1);
    });

    it("deve retornar carrinho vazio quando não há itens", async () => {
      vi.mocked(cartRepository.findOrCreate).mockResolvedValue(mockCart as never);

      const cart = await cartService.getCart(USER_ID);

      expect(cart.total).toBe(0);
      expect(cart.itemCount).toBe(0);
      expect(cart.items).toHaveLength(0);
    });
  });

  describe("addItem", () => {
    it("deve adicionar item ao carrinho com sucesso", async () => {
      vi.mocked(productRepository.findActiveById).mockResolvedValue(
        mockProduct as never
      );
      vi.mocked(cartRepository.findOrCreate).mockResolvedValue(mockCart as never);
      vi.mocked(cartRepository.addItem).mockResolvedValue({} as never);
      vi.mocked(cartRepository.updateTimestamp).mockResolvedValue({} as never);
      vi.mocked(cartRepository.findByUserId).mockResolvedValue(
        mockCartWithItem as never
      );

      const cart = await cartService.addItem(USER_ID, {
        productId: PRODUCT_ID,
        quantity: 2,
      });

      expect(cart.items).toHaveLength(1);
      expect(cartRepository.addItem).toHaveBeenCalledWith(CART_ID, PRODUCT_ID, 2);
    });

    it("deve lançar NotFoundError para produto inexistente", async () => {
      vi.mocked(productRepository.findActiveById).mockResolvedValue(null);

      await expect(
        cartService.addItem(USER_ID, { productId: PRODUCT_ID, quantity: 1 })
      ).rejects.toThrow(NotFoundError);
    });

    it("deve lançar BadRequestError para produto inativo", async () => {
      vi.mocked(productRepository.findActiveById).mockResolvedValue(
        { ...mockProduct, active: false } as never
      );

      await expect(
        cartService.addItem(USER_ID, { productId: PRODUCT_ID, quantity: 1 })
      ).rejects.toThrow(BadRequestError);
    });

    it("deve lançar ValidationError para quantidade inválida (zero)", async () => {
      await expect(
        cartService.addItem(USER_ID, { productId: PRODUCT_ID, quantity: 0 })
      ).rejects.toThrow();
    });

    it("deve lançar ValidationError para quantidade negativa", async () => {
      await expect(
        cartService.addItem(USER_ID, { productId: PRODUCT_ID, quantity: -1 })
      ).rejects.toThrow();
    });
  });

  describe("removeItem", () => {
    const mockItemWithCart = {
      id: ITEM_ID,
      cartId: CART_ID,
      productId: PRODUCT_ID,
      quantity: 2,
      cart: { id: CART_ID, userId: USER_ID, createdAt: new Date(), updatedAt: new Date() },
    };

    it("deve remover item do carrinho com sucesso", async () => {
      vi.mocked(cartRepository.findItemById).mockResolvedValue(
        mockItemWithCart as never
      );
      vi.mocked(cartRepository.removeItem).mockResolvedValue({} as never);
      vi.mocked(cartRepository.updateTimestamp).mockResolvedValue({} as never);
      vi.mocked(cartRepository.findByUserId).mockResolvedValue(mockCart as never);

      const cart = await cartService.removeItem(USER_ID, ITEM_ID);

      expect(cart.items).toHaveLength(0);
      expect(cartRepository.removeItem).toHaveBeenCalledWith(ITEM_ID);
    });

    it("deve lançar ForbiddenError quando o item pertence a outro usuário", async () => {
      vi.mocked(cartRepository.findItemById).mockResolvedValue({
        ...mockItemWithCart,
        cart: { ...mockItemWithCart.cart, userId: OTHER_USER_ID },
      } as never);

      await expect(
        cartService.removeItem(USER_ID, ITEM_ID)
      ).rejects.toThrow(ForbiddenError);
    });

    it("deve lançar NotFoundError para item inexistente", async () => {
      vi.mocked(cartRepository.findItemById).mockResolvedValue(null);

      await expect(
        cartService.removeItem(USER_ID, ITEM_ID)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
