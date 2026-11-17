import { test, expect } from "@playwright/test";

test.describe("Catálogo de Produtos", () => {
  test("deve exibir a página inicial com link para o cardápio", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Cupcake Gourmet/);
    await expect(page.getByRole("heading", { name: /Cupcake/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ver Cardápio|Explorar/i }).first()).toBeVisible();
  });

  test("deve exibir o catálogo de produtos", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveTitle(/Cardápio/);
    await expect(page.getByRole("heading", { name: "Nosso Cardápio" })).toBeVisible();
    // Aguarda ao menos um produto (seed deve estar rodando)
    await expect(page.locator(".grid > div, .grid > a").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("deve filtrar produtos por categoria", async ({ page }) => {
    await page.goto("/products");
    // Clicar no botão de categoria "Clássicos"
    const classicoBtn = page.getByRole("button", { name: "Clássicos" });
    if (await classicoBtn.isVisible()) {
      await classicoBtn.click();
      await expect(page).toHaveURL(/categoryId=/);
    }
  });

  test("deve pesquisar produtos por nome", async ({ page }) => {
    await page.goto("/products");
    const searchInput = page.getByPlaceholder("Buscar cupcakes...");
    await searchInput.fill("chocolate");
    // Aguarda a busca (debounce 400ms)
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/search=chocolate/i);
  });

  test("deve navegar para detalhe do produto", async ({ page }) => {
    await page.goto("/products");
    const verBtn = page.getByRole("link", { name: "Ver" }).first();
    await verBtn.click();
    await expect(page).toHaveURL(/\/products\//);
    // Deve ter botão de adicionar ao carrinho
    await expect(
      page.getByRole("button", { name: "Adicionar ao Carrinho" })
    ).toBeVisible();
  });

  test("deve exibir preço formatado em BRL", async ({ page }) => {
    await page.goto("/products");
    // Verifica que há ao menos um preço no formato R$ XX,XX
    await expect(page.getByText(/R\$\s*\d+,\d{2}/).first()).toBeVisible();
  });

  test("deve exibir página 404 para produto inexistente", async ({ page }) => {
    await page.goto("/products/produto-inexistente-xyz");
    await expect(page.getByText("404")).toBeVisible();
  });
});
