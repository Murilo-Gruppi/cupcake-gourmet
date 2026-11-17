import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { orderService } from "@/modules/orders/order.service";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/OrderStatusBadge";
import { UpdateOrderStatusForm } from "./UpdateOrderStatusForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { ArrowLeft, MapPin, Package, User } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import type { DeliveryAddress } from "@/types/order";

export const metadata: Metadata = { title: "Detalhes do Pedido — Admin" };

interface AdminOrderDetailPageProps {
  params: { id: string };
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  let order;
  try {
    order = await orderService.getOrderById(params.id);
  } catch {
    notFound();
  }

  const address = order.deliveryAddress as DeliveryAddress;
  const orderWithUser = order as unknown as {
    user?: { id: string; name: string; email: string };
  } & typeof order;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Pedidos
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <h1 className="text-xl font-bold font-mono">
            #{order.id.slice(-8).toUpperCase()}
          </h1>
          <OrderStatusBadge status={order.status as OrderStatus} />
          <PaymentStatusBadge status={order.paymentStatus as PaymentStatus} />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Pedido realizado em {formatDateTime(order.createdAt)}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Itens */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" /> Itens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}× {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Cliente */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" /> Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="font-medium">{orderWithUser.user?.name ?? "—"}</p>
            <p className="text-muted-foreground">{orderWithUser.user?.email ?? "—"}</p>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-0.5">
            <p className="font-medium text-foreground">
              {address.street}, {address.number}
              {address.complement ? `, ${address.complement}` : ""}
            </p>
            <p>{address.neighborhood}</p>
            <p>{address.city} — {address.state}</p>
            <p>CEP: {address.zipCode}</p>
          </CardContent>
        </Card>

        {/* Atualizar status */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Atualizar Status do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateOrderStatusForm
              orderId={order.id}
              currentStatus={order.status as OrderStatus}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
