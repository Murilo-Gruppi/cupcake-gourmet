import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "@/modules/auth/auth.service";
import { authRepository } from "@/modules/auth/auth.repository";
import { ConflictError, ValidationError } from "@/lib/errors";

vi.mock("@/modules/auth/auth.repository");
vi.mock("bcryptjs", () => ({
  hash: vi.fn().mockResolvedValue("hashed_password_$2b$12$"),
  compare: vi.fn().mockResolvedValue(true),
}));

const validInput = {
  name: "Maria Silva",
  email: "maria@exemplo.com",
  password: "Senha@123456",
};

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("deve cadastrar um novo usuário com sucesso", async () => {
      vi.mocked(authRepository.existsByEmail).mockResolvedValue(false);
      vi.mocked(authRepository.create).mockResolvedValue({
        id: "cjld2cjxh0000qzrmn831i7rn",
        name: validInput.name,
        email: validInput.email,
        role: "CUSTOMER",
      });

      const user = await authService.register(validInput);

      expect(user.email).toBe(validInput.email);
      expect(user.role).toBe("CUSTOMER");
      // Nunca deve retornar o hash da senha
      expect(user).not.toHaveProperty("passwordHash");
    });

    it("deve fazer hash da senha antes de salvar (RNF004)", async () => {
      const { hash } = await import("bcryptjs");
      vi.mocked(authRepository.existsByEmail).mockResolvedValue(false);
      vi.mocked(authRepository.create).mockResolvedValue({
        id: "cjld2cjxh0000qzrmn831i7rn",
        name: validInput.name,
        email: validInput.email,
        role: "CUSTOMER",
      });

      await authService.register(validInput);

      expect(hash).toHaveBeenCalledWith(validInput.password, 12);
      expect(authRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          passwordHash: "hashed_password_$2b$12$",
        })
      );
    });

    it("deve lançar ConflictError para e-mail já cadastrado", async () => {
      vi.mocked(authRepository.existsByEmail).mockResolvedValue(true);

      await expect(authService.register(validInput)).rejects.toThrow(
        ConflictError
      );
      expect(authRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar ValidationError para e-mail inválido", async () => {
      await expect(
        authService.register({ ...validInput, email: "nao-é-email" })
      ).rejects.toThrow(ValidationError);
    });

    it("deve lançar ValidationError para senha muito curta (< 8 chars)", async () => {
      await expect(
        authService.register({ ...validInput, password: "123" })
      ).rejects.toThrow(ValidationError);
    });

    it("deve lançar ValidationError para nome muito curto (< 2 chars)", async () => {
      await expect(
        authService.register({ ...validInput, name: "A" })
      ).rejects.toThrow(ValidationError);
    });

    it("deve normalizar o e-mail para lowercase", async () => {
      vi.mocked(authRepository.existsByEmail).mockResolvedValue(false);
      vi.mocked(authRepository.create).mockResolvedValue({
        id: "cjld2cjxh0000qzrmn831i7rn",
        name: validInput.name,
        email: "maria@exemplo.com",
        role: "CUSTOMER",
      });

      await authService.register({
        ...validInput,
        email: "MARIA@EXEMPLO.COM",
      });

      expect(authRepository.existsByEmail).toHaveBeenCalledWith(
        "maria@exemplo.com"
      );
    });
  });
});
