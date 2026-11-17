import { Badge } from "@/components/ui/badge";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" | "success" | "warning" }
> = {
  PENDING: { label: "Pendente", variant: "secondary" },
  CONFIRMED: { label: "Confirmado", variant: "default" },
  PREPARING: { label: "Em Preparo", variant: "warning" },
  OUT_FOR_DELIVERY: { label: "Em Entrega", variant: "default" },
  COMPLETED: { label: "Concluído", variant: "success" },
  CANCELED: { label: "Cancelado", variant: "destructive" },
};

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" | "success" | "warning" }
> = {
  PENDING: { label: "Aguardando", variant: "secondary" },
  PROCESSING: { label: "Processando", variant: "warning" },
  PAID: { label: "Pago", variant: "success" },
  FAILED: { label: "Falhou", variant: "destructive" },
  REFUNDED: { label: "Reembolsado", variant: "outline" },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = PAYMENT_STATUS_CONFIG[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
