"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";

interface CartItemRowProps {
  item: {
    id: string;
    productId: string;
    productName: string;
    productPrice: number;
    productImageUrl: string | null;
    quantity: number;
    subtotal: number;
  };
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateItem, removeItem, loading } = useCart();
  const [localQty, setLocalQty] = useState(item.quantity);

  async function handleQuantityChange(delta: number) {
    const next = Math.max(1, Math.min(99, localQty + delta));
    setLocalQty(next);
    await updateItem(item.id, next);
  }

  async function handleRemove() {
    await removeItem(item.id);
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      {/* Imagem */}
      <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-secondary/50">
        {item.productImageUrl ? (
          <Image
            src={item.productImageUrl}
            alt={item.productName}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🧁</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.productName}</p>
        <p className="text-primary font-semibold text-sm mt-0.5">
          {formatCurrency(item.productPrice)}
        </p>
      </div>

      {/* Quantidade */}
      <div className="flex items-center border rounded-lg overflow-hidden shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none"
          onClick={() => handleQuantityChange(-1)}
          disabled={loading || localQty <= 1}
          aria-label="Diminuir"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-semibold">
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin mx-auto" />
          ) : (
            localQty
          )}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none"
          onClick={() => handleQuantityChange(1)}
          disabled={loading || localQty >= 99}
          aria-label="Aumentar"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Subtotal */}
      <p className="font-bold text-sm w-20 text-right shrink-0">
        {formatCurrency(item.subtotal)}
      </p>

      {/* Remover */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
        onClick={handleRemove}
        disabled={loading}
        aria-label="Remover item"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
