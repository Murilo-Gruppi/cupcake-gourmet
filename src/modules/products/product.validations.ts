import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(150, "Nome deve ter no máximo 150 caracteres.")
    .trim(),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres.")
    .max(1000, "Descrição deve ter no máximo 1000 caracteres.")
    .trim(),
  price: z
    .number({ invalid_type_error: "Preço deve ser um número." })
    .positive("Preço deve ser maior que zero.")
    .multipleOf(0.01, "Preço deve ter no máximo 2 casas decimais."),
  imageUrl: z
    .string()
    .url("URL de imagem inválida.")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().cuid("Categoria inválida."),
});

export const updateProductSchema = createProductSchema
  .partial()
  .extend({
    active: z.boolean().optional(),
  });

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().cuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
