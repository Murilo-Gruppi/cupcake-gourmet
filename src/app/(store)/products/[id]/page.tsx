import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { productService } from "@/modules/products/product.service";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/format";
import { AddToCartButton } from "./AddToCartButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await productService.getActiveProductById(params.id);
    return { title: product.name };
  } catch {
    return { title: "Produto não encontrado" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  try {
    product = await productService.getActiveProductById(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="container py-8">
      {/* Voltar */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/products">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar ao cardápio
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagem */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              🧁
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <Badge variant="outline">{product.categoryName}</Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
          </div>

          <Separator />

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
