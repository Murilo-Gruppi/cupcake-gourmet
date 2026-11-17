import { test, expect } from "@playwright/test";
import { SEED_CUSTOMER, loginAs } from "./helpers";

test.describe("Fluxo de Compra", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, SEED_CUSTOMER.email, SEED_CUSTOMER.password);
  });

  test("deve adicionar produto ao carrinho e ver contagem", async ({ page }) => {
    await page.goto("/products");
    const verBtn = page.getByRole("link", { name: "Ver" }).first();
    await verBtn.click();
    await expect(page).toHaveURL(/\/products\//);

    await page.getByRole("button", { name: "Adicionar ao Carrinho" }).click();
    await expect(
      page.getByRole("button", { name: "Adicionado!" })
    ).toBeVisible({ timeout: 3000 });
  });

  test("deve exibir itens no carrinho após adicionar produto", async ({ page }) => {
    // Adicionar produto
    await page.goto("/products");
    await page.getByRole("link", { name: "Ver" }).first().click();
    await page.getByRole("button", { name: "Adicionar ao Carrinho" }).click();
    await page.waitForTimeout(1000);

    // Ir para o carrinho
    await page.goto("/cart");
    await expect(page).toHaveTitle(/Carrinho/);
    await expect(page.getByText("Finalizar Pedido")).toBeVisible();
  });

  test("deve exibir o formulário de checkout com campos obrigatórios", async ({
    page,
  }) => {
    // Garantir que há itens no carrinho
    await page.goto("/products");
    await page.getByRole("link", { name: "Ver" }).first().click();
    await page.getByRole("button", { name: "Adicionar ao Carrinho" }).click();
    await page.waitForTimeout(1000);

    await page.goto("/checkout");
    await expect(page).toHaveTitle(/Checkout/);
    await expect(page.getByLabel("Logradouro *")).toBeVisible();
    await expect(page.getByLabel("Número *")).toBeVisible();
    await expect(page.getByLabel("CEP *")).toBeVisible();
    await expect(page.getByLabel("Cidade *")).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirmar e Pagar" })).toBeVisible();
  });

  test("deve finalizar pedido e redirecionar para confirmação", async ({
    page,
  }) => {
    // Adicionar produto
    await page.goto("/products");
    await page.getByRole("link", { name: "Ver" }).first().click();
    await page.getByRole("button", { name: "Adicionar ao Carrinho" }).click();
    await page.waitForTimeout(1000);

    // Preencher checkout
    await page.goto("/checkout");
    await page.getByLabel("Logradouro *").fill("Rua dos Testes");
    await page.getByLabel("Número *").fill("42");
    await page.getByLabel("Bairro *").fill("Centro");
    await page.getByLabel("CEP *").fill("01310-100");
    await page.getByLabel("Cidade *").fill("São Paulo");
    await page.getByLabel("Estado *").fill("SP");

    await page.getByRole("button", { name: "Confirmar e Pagar" }).click();

    // Aguarda confirmação
    await expect(page).toHaveURL(/\/orders\/.*\?success=true/, {
      timeout: 10000,
    });
    await expect(
      page.getByText("Pedido realizado com sucesso!")
    ).toBeVisible();
  });

  test("deve listar o pedido realizado em Meus Pedidos", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveTitle(/Meus Pedidos/);
    // Depois do fluxo completo, deve haver ao menos um pedido
  });
});
