import { hash } from "bcryptjs";
import { authRepository } from "./auth.repository";
import { registerSchema } from "./auth.validations";
import { ConflictError, ValidationError } from "@/lib/errors";
import type { RegisterInput } from "./auth.validations";

export const authService = {
  async register(input: RegisterInput) {
    // Validar dados de entrada
    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors as Record<string, string[]>;
      throw new ValidationError("Dados de cadastro inválidos.", fields);
    }

    const { name, email, password } = parsed.data;

    // Verificar se e-mail já existe
    const exists = await authRepository.existsByEmail(email);
    if (exists) {
      throw new ConflictError("Este e-mail já está cadastrado.");
    }

    // Hash da senha (custo 12 — seguro e razoavelmente rápido)
    const passwordHash = await hash(password, 12);

    // Criar usuário
    const user = await authRepository.create({ name, email, passwordHash });
    return user;
  },
};
