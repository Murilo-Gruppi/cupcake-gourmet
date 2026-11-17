"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook para operações no carrinho autenticado (via API).
 * Encapsula fetch, loading state e tratamento de erros.
 */
export function useCart() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      setLoading(false);
      if (res.status === 401) {
        router.push("/login");
        return false;
      }
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Erro ao adicionar produto.");
        return false;
      }
      router.refresh();
      return true;
    },
    [router]
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      setLoading(false);
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Erro ao atualizar item.");
        return false;
      }
      router.refresh();
      return true;
    },
    [router]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });
      setLoading(false);
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Erro ao remover item.");
        return false;
      }
      router.refresh();
      return true;
    },
    [router]
  );

  return { addItem, updateItem, removeItem, loading, error };
}
