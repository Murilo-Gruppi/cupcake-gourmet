import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "./OrderStatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { ArrowRight } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

interface OrderCardProps {
  order: {
    id: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: Date;
    items: { productName: string; quantity: number }[];
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const preview = order.items
    .slice(0, 2)
    .map((i) => `${i.quantity}× ${i.productName}`)
    .join(", ");
  const extra = order.items.length > 2 ? ` +${order.items.length - 2} mais` : "";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              #{order.id.slice(-8).toUpperCase()}
            </span>
            <OrderStatusBadge status={order.status as OrderStatus} />
            <PaymentStatusBadge status={order.paymentStatus as PaymentStatus} />
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {preview}{extra}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="font-bold text-primary">
            {formatCurrency(order.total)}
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/orders/${order.id}`}>
              Ver detalhes <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
