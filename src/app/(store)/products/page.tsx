import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { productService } from "@/modules/products/product.service";
import { ProductGrid, ProductGridSkeleton } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductSearch } from "@/components/products/ProductSearch";

export const metadata: Metadata = { title: "Cardápio" };

interface ProductsPageProps {
  searchParams: {
    search?: string;
    categoryId?: string;
    page?: string;
  };
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const [result, categories] = await Promise.all([
    productService.listProducts(searchParams),
    productService.listCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <ProductSearch />
        <CategoryFilter categories={categories} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {result.total === 0
            ? "Nenhum produto"
            : `${result.total} produto${result.total !== 1 ? "s" : ""} encontrado${result.total !== 1 ? "s" : ""}`}
        </p>
      </div>

      <ProductGrid products={result.items} />

      {/* Paginação com Link (sem full reload) */}
      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            if (searchParams.search) params.set("search", searchParams.search);
            if (searchParams.categoryId) params.set("categoryId", searchParams.categoryId);
            params.set("page", String(p));
            const currentPage = searchParams.page ? Number(searchParams.page) : 1;
            return (
              <Link
                key={p}
                href={`/products?${params.toString()}`}
                className={`inline-flex items-center justify-center h-9 w-9 rounded-md border text-sm font-medium transition-colors ${
                  currentPage === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nosso Cardápio</h1>
        <p className="text-muted-foreground mt-1">
          Escolha seus cupcakes favoritos
        </p>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
