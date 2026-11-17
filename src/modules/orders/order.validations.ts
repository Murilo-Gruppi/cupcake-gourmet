import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const deliveryAddressSchema = z.object({
  street: z.string().min(3, "Logradouro inválido.").trim(),
  number: z.string().min(1, "Número é obrigatório.").trim(),
  complement: z.string().max(100).optional().or(z.literal("")),
  neighborhood: z.string().min(2, "Bairro inválido.").trim(),
  city: z.string().min(2, "Cidade inválida.").trim(),
  state: z
    .string()
    .length(2, "Estado deve ter 2 caracteres.")
    .toUpperCase()
    .trim(),
  zipCode: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido. Use o formato 00000-000.")
    .trim(),
});

export const createOrderSchema = z.object({
  deliveryAddress: deliveryAddressSchema,
  paymentMethod: z
    .string()
    .min(1, "Forma de pagamento é obrigatória.")
    .default("demo"),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, {
    errorMap: () => ({ message: "Status de pedido inválido." }),
  }),
});

export type DeliveryAddressInput = z.infer<typeof deliveryAddressSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
