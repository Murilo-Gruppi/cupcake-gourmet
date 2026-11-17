import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "@/modules/auth/auth.validations";
import { createProductSchema, updateProductSchema } from "@/modules/products/product.validations";
import { addCartItemSchema, updateCartItemSchema } from "@/modules/cart/cart.validations";
import { createOrderSchema, deliveryAddressSchema } from "@/modules/orders/order.validations";

// CUID válido para testes
const VALID_CUID = "cjld2cjxh0000qzrmn831i7rn";

// ─── Auth ──────────────────────────────────────────────────────────────────

describe("registerSchema", () => {
  const valid = { name: "Ana Lima", email: "ana@test.com", password: "Senha@123" };

  it("aceita dados válidos", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("normaliza email para lowercase", () => {
    const r = registerSchema.safeParse({ ...valid, email: "ANA@TEST.COM" });
    expect(r.success && r.data.email).toBe("ana@test.com");
  });

  it("rejeita email inválido", () => {
    expect(registerSchema.safeParse({ ...valid, email: "invalido" }).success).toBe(false);
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    expect(registerSchema.safeParse({ ...valid, password: "123" }).success).toBe(false);
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    expect(registerSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("aceita credenciais válidas", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "123" }).success).toBe(true);
  });

  it("rejeita senha vazia", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

// ─── Produtos ──────────────────────────────────────────────────────────────

describe("createProductSchema", () => {
  const valid = {
    name: "Chocolate Belga",
    description: "Descrição com pelo menos dez caracteres",
    price: 12.9,
    categoryId: VALID_CUID,
  };

  it("aceita produto válido", () => {
    expect(createProductSchema.safeParse(valid).success).toBe(true);
  });

  it("rejeita preço negativo", () => {
    expect(createProductSchema.safeParse({ ...valid, price: -1 }).success).toBe(false);
  });

  it("rejeita preço zero", () => {
    expect(createProductSchema.safeParse({ ...valid, price: 0 }).success).toBe(false);
  });

  it("rejeita descrição com menos de 10 chars", () => {
    expect(createProductSchema.safeParse({ ...valid, description: "curta" }).success).toBe(false);
  });

  it("aceita imageUrl vazia (campo opcional)", () => {
    expect(createProductSchema.safeParse({ ...valid, imageUrl: "" }).success).toBe(true);
  });

  it("rejeita imageUrl com URL inválida", () => {
    expect(createProductSchema.safeParse({ ...valid, imageUrl: "nao-url" }).success).toBe(false);
  });
});

describe("updateProductSchema", () => {
  it("aceita atualização parcial (apenas active)", () => {
    expect(updateProductSchema.safeParse({ active: false }).success).toBe(true);
  });

  it("aceita atualização parcial (apenas price)", () => {
    expect(updateProductSchema.safeParse({ price: 15.9 }).success).toBe(true);
  });

  it("rejeita price negativo na atualização", () => {
    expect(updateProductSchema.safeParse({ price: -5 }).success).toBe(false);
  });
});

// ─── Carrinho ──────────────────────────────────────────────────────────────

describe("addCartItemSchema", () => {
  it("aceita item válido", () => {
    expect(addCartItemSchema.safeParse({ productId: VALID_CUID, quantity: 2 }).success).toBe(true);
  });

  it("rejeita quantidade zero (RN10)", () => {
    expect(addCartItemSchema.safeParse({ productId: VALID_CUID, quantity: 0 }).success).toBe(false);
  });

  it("rejeita quantidade negativa (RN10)", () => {
    expect(addCartItemSchema.safeParse({ productId: VALID_CUID, quantity: -1 }).success).toBe(false);
  });

  it("rejeita quantidade acima de 99", () => {
    expect(addCartItemSchema.safeParse({ productId: VALID_CUID, quantity: 100 }).success).toBe(false);
  });

  it("rejeita quantidade decimal", () => {
    expect(addCartItemSchema.safeParse({ productId: VALID_CUID, quantity: 1.5 }).success).toBe(false);
  });
});

describe("updateCartItemSchema", () => {
  it("aceita quantidade mínima (1)", () => {
    expect(updateCartItemSchema.safeParse({ quantity: 1 }).success).toBe(true);
  });

  it("rejeita quantidade zero", () => {
    expect(updateCartItemSchema.safeParse({ quantity: 0 }).success).toBe(false);
  });
});

// ─── Pedidos ───────────────────────────────────────────────────────────────

describe("deliveryAddressSchema", () => {
  const valid = {
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
  };

  it("aceita endereço válido", () => {
    expect(deliveryAddressSchema.safeParse(valid).success).toBe(true);
  });

  it("aceita CEP sem hífen", () => {
    expect(deliveryAddressSchema.safeParse({ ...valid, zipCode: "01310100" }).success).toBe(true);
  });

  it("rejeita CEP inválido", () => {
    expect(deliveryAddressSchema.safeParse({ ...valid, zipCode: "12345" }).success).toBe(false);
  });

  it("rejeita estado com mais de 2 chars", () => {
    expect(deliveryAddressSchema.safeParse({ ...valid, state: "SPP" }).success).toBe(false);
  });

  it("normaliza estado para uppercase", () => {
    const r = deliveryAddressSchema.safeParse({ ...valid, state: "sp" });
    expect(r.success && r.data.state).toBe("SP");
  });

  it("aceita complemento como opcional", () => {
    expect(deliveryAddressSchema.safeParse({ ...valid, complement: "" }).success).toBe(true);
    expect(deliveryAddressSchema.safeParse({ ...valid, complement: "Apto 42" }).success).toBe(true);
  });
});

describe("createOrderSchema", () => {
  const validAddress = {
    street: "Rua das Flores",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
  };

  it("aceita pedido válido com método de pagamento", () => {
    expect(
      createOrderSchema.safeParse({
        deliveryAddress: validAddress,
        paymentMethod: "demo",
      }).success
    ).toBe(true);
  });

  it("usa 'demo' como método padrão", () => {
    const r = createOrderSchema.safeParse({ deliveryAddress: validAddress });
    expect(r.success && r.data.paymentMethod).toBe("demo");
  });

  it("rejeita endereço com CEP inválido", () => {
    expect(
      createOrderSchema.safeParse({
        deliveryAddress: { ...validAddress, zipCode: "invalido" },
        paymentMethod: "demo",
      }).success
    ).toBe(false);
  });
});
