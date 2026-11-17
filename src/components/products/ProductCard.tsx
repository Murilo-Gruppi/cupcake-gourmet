import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import { ShoppingCart } from "lucide-react";
import type { ProductDTO } from "@/types/product";

interface ProductCardProps {
  product: ProductDTO;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🧁
          </div>
        )}
        {!product.active && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <Badge variant="secondary">Indisponível</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>
        <Badge variant="outline" className="text-xs mb-2">
          {product.categoryName}
        </Badge>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-primary font-bold text-lg">
          {formatCurrency(product.price)}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/products/${product.id}`}>Ver</Link>
          </Button>
          {product.active && (
            <Button size="sm" asChild>
              <Link href={`/products/${product.id}`}>
                <ShoppingCart className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
