/**
 * Testes de integração — Autenticação
 *
 * Requerem banco PostgreSQL ativo.
 * Execute: npm run db:up && npx vitest run tests/integration/auth.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { authService } from "@/modules/auth/auth.service";
import { ConflictError, ValidationError } from "@/lib/errors";
import {
  checkDbAvailability,
  cleanupTestData,
  testPrisma,
} from "./setup";

let isDbAvailable = false;
const createdUserIds: string[] = [];

beforeAll(async () => {
  isDbAvailable = await checkDbAvailability();
});

afterAll(async () => {
  if (isDbAvailable) {
    await cleanupTestData({ userIds: createdUserIds });
    await testPrisma.$disconnect();
  }
});

describe("authService — integração", () => {
  it.skipIf(!isDbAvailable)(
    "deve criar usuário no banco e retornar sem passwordHash",
    async () => {
      const email = `int_test_${Date.now()}@test.com`;
      const user = await authService.register({
        name: "Usuário Integração",
        email,
        password: "Senha@12345",
      });

      createdUserIds.push(user.id);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.role).toBe("CUSTOMER");
      expect(user).not.toHaveProperty("passwordHash");

      // Confirmar persistência no banco
      const inDb = await testPrisma.user.findUnique({ where: { id: user.id } });
      expect(inDb).not.toBeNull();
      expect(inDb!.passwordHash).not.toBe("Senha@12345");
      expect(inDb!.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt hash
    }
  );

  it.skipIf(!isDbAvailable)(
    "deve rejeitar e-mail duplicado no banco (ConflictError)",
    async () => {
      const email = `dup_${Date.now()}@test.com`;
      const first = await authService.register({
        name: "Primeiro",
        email,
        password: "Senha@12345",
      });
      createdUserIds.push(first.id);

      await expect(
        authService.register({ name: "Segundo", email, password: "Senha@12345" })
      ).rejects.toThrow(ConflictError);
    }
  );
});
