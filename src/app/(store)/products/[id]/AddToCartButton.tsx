"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, Minus, Plus, CheckCircle2 } from "lucide-react";
import type { ProductDTO } from "@/types/product";

interface AddToCartButtonProps {
  product: ProductDTO;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddToCart() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity }),
    });

    setLoading(false);

    if (res.status === 401) {
      router.push(`/login?callbackUrl=/products/${product.id}`);
      return;
    }

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Erro ao adicionar ao carrinho.");
      return;
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Seletor de quantidade */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Quantidade:</span>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || loading}
            aria-label="Diminuir quantidade"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-10 text-center text-sm font-semibold">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            disabled={quantity >= 99 || loading}
            aria-label="Aumentar quantidade"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={loading || added}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adicionando...
          </>
        ) : added ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Adicionado!
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Adicionar ao Carrinho
          </>
        )}
      </Button>
    </div>
  );
}
