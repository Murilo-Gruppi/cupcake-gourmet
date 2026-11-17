import { test, expect } from "@playwright/test";
import { SEED_CUSTOMER, TEST_CUSTOMER, registerCustomer, loginAs } from "./helpers";

test.describe("Autenticação", () => {
  test("deve exibir a página de login corretamente", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Entrar/);
    await expect(page.getByRole("heading", { name: "Bem-vindo de volta" })).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  test("deve exibir a página de cadastro corretamente", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveTitle(/Criar Conta/);
    await expect(page.getByLabel("Nome completo")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
  });

  test("deve exibir erro para credenciais inválidas", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("inexistente@test.com");
    await page.getByLabel("Senha").fill("SenhaErrada123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(
      page.getByText("E-mail ou senha incorretos.")
    ).toBeVisible({ timeout: 5000 });
  });

  test("deve fazer login com credenciais do seed", async ({ page }) => {
    await loginAs(page, SEED_CUSTOMER.email, SEED_CUSTOMER.password);
    // Após login, deve estar na página inicial e ver o nome do usuário
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Cliente")).toBeVisible();
  });

  test("deve cadastrar novo cliente e redirecionar para início", async ({ page }) => {
    const email = `e2e_${Date.now()}@test.com`;
    await registerCustomer(page, "Novo Cliente E2E", email, "Teste@12345");
    await expect(page).toHaveURL("/");
  });

  test("deve proteger rota /checkout para não autenticados", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/login/);
  });

  test("deve proteger rota /admin para não autenticados", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("deve bloquear acesso admin para clientes comuns", async ({ page }) => {
    await loginAs(page, SEED_CUSTOMER.email, SEED_CUSTOMER.password);
    await page.goto("/admin");
    // Deve redirecionar para início (não para login, pois está autenticado)
    await expect(page).toHaveURL("/");
  });
});
