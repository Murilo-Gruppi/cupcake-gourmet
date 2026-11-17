"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PowerOff, Loader2 } from "lucide-react";

interface DeactivateProductButtonProps {
  productId: string;
}

export function DeactivateProductButton({ productId }: DeactivateProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDeactivate() {
    if (!confirm("Deseja desativar este produto? Ele não aparecerá mais no catálogo.")) {
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
    } else {
      const json = await res.json();
      alert(json.error ?? "Erro ao desativar produto.");
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDeactivate}
      disabled={loading}
      aria-label="Desativar produto"
      className="text-muted-foreground hover:text-destructive"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <PowerOff className="h-4 w-4" />
      )}
    </Button>
  );
}
