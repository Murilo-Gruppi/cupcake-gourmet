import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(100, "Nome deve ter no máximo 100 caracteres.")
    .trim(),
  email: z
    .string()
    .email("E-mail inválido.")
    .max(255, "E-mail deve ter no máximo 255 caracteres.")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres.")
    .max(72, "Senha deve ter no máximo 72 caracteres."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("E-mail inválido.")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Senha é obrigatória."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
