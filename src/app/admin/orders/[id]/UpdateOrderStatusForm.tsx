"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { OrderStatus } from "@prisma/client";

const STATUS_FLOW: { value: OrderStatus; label: string; description: string }[] = [
  { value: "PENDING", label: "Pendente", description: "Aguardando confirmação" },
  { value: "CONFIRMED", label: "Confirmado", description: "Pedido confirmado" },
  { value: "PREPARING", label: "Em Preparo", description: "Cupcakes sendo preparados" },
  { value: "OUT_FOR_DELIVERY", label: "Em Entrega", description: "Saiu para entrega" },
  { value: "COMPLETED", label: "Concluído", description: "Entregue ao cliente" },
  { value: "CANCELED", label: "Cancelado", description: "Pedido cancelado" },
];

interface UpdateOrderStatusFormProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function UpdateOrderStatusForm({
  orderId,
  currentStatus,
}: UpdateOrderStatusFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);

  const hasChanged = selected !== currentStatus;

  async function handleUpdate() {
    if (!hasChanged) return;
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selected }),
    });

    setLoading(false);

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Erro ao atualizar status.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {STATUS_FLOW.map(({ value, label, description }) => (
          <button
            key={value}
            type="button"
            onClick={() => setSelected(value)}
            disabled={loading}
            className={cn(
              "flex flex-col items-start p-3 rounded-lg border text-left transition-all",
              selected === value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/50",
              value === "CANCELED" && selected !== "CANCELED"
                ? "hover:border-destructive/50"
                : ""
            )}
          >
            <span
              className={cn(
                "text-sm font-medium",
                selected === value ? "text-primary" : "text-foreground",
                value === "CANCELED" && selected === "CANCELED"
                  ? "text-destructive"
                  : ""
              )}
            >
              {label}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">{description}</span>
          </button>
        ))}
      </div>

      <Button
        onClick={handleUpdate}
        disabled={!hasChanged || loading}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Atualizando...
          </>
        ) : (
          "Salvar Status"
        )}
      </Button>
    </div>
  );
}
