"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PowerOff, Loader2 } from "lucide-react";

interface DeactivateProductButtonProps {
  productId: string;
  productName: string;
}

export function DeactivateProductButton({
  productId,
  productName,
}: DeactivateProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDeactivate() {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error ?? "Erro ao desativar produto.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Desativar produto"
          className="text-muted-foreground hover:text-destructive"
        >
          <PowerOff className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desativar produto</DialogTitle>
          <DialogDescription>
            O produto <strong>{productName}</strong> será removido do catálogo e
            não poderá mais ser adicionado ao carrinho. O histórico de pedidos
            será preservado.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeactivate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Desativando...
              </>
            ) : (
              "Desativar produto"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
