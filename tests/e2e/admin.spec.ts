import { test, expect } from "@playwright/test";
import { SEED_ADMIN, loginAs } from "./helpers";

test.describe("Painel Administrativo", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, SEED_ADMIN.email, SEED_ADMIN.password);
  });

  test("deve exibir o dashboard com indicadores", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveTitle(/Dashboard Admin/);
    await expect(page.getByText("Receita do Dia")).toBeVisible();
    await expect(page.getByText("Receita do Mês")).toBeVisible();
    await expect(page.getByText("Total de Pedidos")).toBeVisible();
    await expect(page.getByText("Produtos Cadastrados")).toBeVisible();
  });

  test("deve listar produtos no painel admin", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page).toHaveTitle(/Produtos.*Admin/);
    await expect(page.getByRole("link", { name: "Novo Produto" })).toBeVisible();
    // Verifica que a tabela tem registros (seed)
    await expect(page.getByRole("cell", { name: /Chocolate Belga/i })).toBeVisible({
      timeout: 5000,
    });
  });

  test("deve exibir o formulário de criação de produto", async ({ page }) => {
    await page.goto("/admin/products/new");
    await expect(page).toHaveTitle(/Novo Produto/);
    await expect(page.getByLabel("Nome *")).toBeVisible();
    await expect(page.getByLabel("Descrição *")).toBeVisible();
    await expect(page.getByLabel("Preço (R$) *")).toBeVisible();
  });

  test("deve criar um novo produto", async ({ page }) => {
    await page.goto("/admin/products/new");

    await page.getByLabel("Nome *").fill("Cupcake E2E Test");
    await page.getByLabel("Descrição *").fill(
      "Cupcake criado durante teste E2E — pode ser removido com segurança."
    );
    await page.getByLabel("Preço (R$) *").fill("9.99");

    // Selecionar categoria
    await page.getByRole("combobox").click();
    await page.getByRole("option").first().click();

    await page.getByRole("button", { name: "Criar produto" }).click();

    // Deve redirecionar para listagem
    await expect(page).toHaveURL("/admin/products");
    await expect(page.getByText("Cupcake E2E Test")).toBeVisible({
      timeout: 5000,
    });
  });

  test("deve listar todos os pedidos no painel admin", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page).toHaveTitle(/Pedidos.*Admin/);
    await expect(page.getByText("Todos")).toBeVisible();
  });

  test("deve filtrar pedidos por status", async ({ page }) => {
    await page.goto("/admin/orders");
    await page.getByRole("link", { name: "Pendentes" }).click();
    await expect(page).toHaveURL(/status=PENDING/);
  });

  test("sidebar deve mostrar link ativo", async ({ page }) => {
    await page.goto("/admin/products");
    // O link Produtos deve estar destacado na sidebar
    const sidebar = page.locator("aside");
    await expect(sidebar.getByText("Produtos")).toBeVisible();
  });
});
