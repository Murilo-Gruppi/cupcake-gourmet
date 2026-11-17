import { type Page, expect } from "@playwright/test";

export const TEST_CUSTOMER = {
  name: "Cliente E2E",
  email: `e2e_customer_${Date.now()}@test.com`,
  password: "Teste@12345",
};

export const SEED_ADMIN = {
  email: "admin@cupcakegourmet.com",
  password: "Admin@123456",
};

export const SEED_CUSTOMER = {
  email: "cliente@exemplo.com",
  password: "Cliente@123456",
};

/**
 * Faz login via formulário e aguarda redirecionamento.
 */
export async function loginAs(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

/**
 * Registra um novo cliente e aguarda login automático.
 */
export async function registerCustomer(
  page: Page,
  name: string,
  email: string,
  password: string
) {
  await page.goto("/register");
  await page.getByLabel("Nome completo").fill(name);
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Criar conta" }).click();
  // Aguarda redirecionamento pós-cadastro
  await page.waitForURL("/");
}

/**
 * Adiciona o primeiro produto disponível ao carrinho.
 */
export async function addFirstProductToCart(page: Page) {
  await page.goto("/products");
  const verBtn = page.getByRole("link", { name: "Ver" }).first();
  await verBtn.click();
  await expect(page).toHaveURL(/\/products\//);
  await page.getByRole("button", { name: "Adicionar ao Carrinho" }).click();
  await expect(
    page.getByRole("button", { name: "Adicionado!" })
  ).toBeVisible({ timeout: 3000 });
}
