import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productService } from "@/modules/products/product.service";
import { ProductForm } from "../ProductForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Editar Produto — Admin" };

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  let product;
  try {
    product = await productService.getProductById(params.id);
  } catch {
    notFound();
  }

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
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Editar Produto</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{product.name}</p>
          </div>
          <Badge variant={product.active ? "success" : "secondary"}>
            {product.active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </div>

      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}
