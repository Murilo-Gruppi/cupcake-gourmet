import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1, "ID de produto é obrigatório."),
  quantity: z
    .number()
    .int("Quantidade deve ser um número inteiro.")
    .min(1, "Quantidade mínima é 1.")
    .max(99, "Quantidade máxima é 99."),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int("Quantidade deve ser um número inteiro.")
    .min(1, "Quantidade mínima é 1.")
    .max(99, "Quantidade máxima é 99."),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
