import type { Metadata } from "next";
import Link from "next/link";
import { productService } from "@/modules/products/product.service";
import { ProductForm } from "../ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Novo Produto — Admin" };

export default async function NewProductPage() {
  const categories = await productService.listCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Novo Produto</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Preencha os dados do novo cupcake
          </p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
