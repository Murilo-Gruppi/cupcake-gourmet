import type { Metadata } from "next";
import Link from "next/link";
import { productService } from "@/modules/products/product.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import { Plus, Pencil, PowerOff } from "lucide-react";
import { DeactivateProductButton } from "./DeactivateProductButton";

export const metadata: Metadata = { title: "Produtos — Admin" };

interface AdminProductsPageProps {
  searchParams: { page?: string; search?: string };
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const result = await productService.listProductsAdmin({
    page: searchParams.page ? Number(searchParams.page) : 1,
    search: searchParams.search,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {result.total} produto{result.total !== 1 ? "s" : ""} cadastrado{result.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-1" />
            Novo Produto
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Produto</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Categoria</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Preço</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {result.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted-foreground">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            ) : (
              result.items.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {product.categoryName}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={product.active ? "success" : "secondary"}>
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}`} aria-label="Editar">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      {product.active && (
                        <DeactivateProductButton productId={product.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
