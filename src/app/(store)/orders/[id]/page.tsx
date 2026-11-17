import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { orderService } from "@/modules/orders/order.service";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { ArrowLeft, CheckCircle2, MapPin, Package } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import type { DeliveryAddress } from "@/types/order";

export const metadata: Metadata = { title: "Detalhes do Pedido" };

interface OrderDetailPageProps {
  params: { id: string };
  searchParams: { success?: string };
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const session = await auth();
  if (!session) redirect("/login");

  let order;
  try {
    order = await orderService.getUserOrderById(params.id, session.user.id);
  } catch {
    notFound();
  }

  const address = order.deliveryAddress as DeliveryAddress;
  const isSuccess = searchParams.success === "true";

  return (
    <div className="container py-8 max-w-3xl">
      {isSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Pedido realizado com sucesso!</p>
            <p className="text-xs text-green-700">
              Obrigado pela sua compra. Estamos preparando com carinho! 🧁
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Meus Pedidos
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold font-mono">
              #{order.id.slice(-8).toUpperCase()}
            </h1>
            <OrderStatusBadge status={order.status as OrderStatus} />
            <PaymentStatusBadge status={order.paymentStatus as PaymentStatus} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Realizado em {formatDateTime(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Itens */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" /> Itens do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}× {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Entrega</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Endereço de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-0.5">
            <p className="font-medium text-foreground">
              {address.street}, {address.number}
              {address.complement ? `, ${address.complement}` : ""}
            </p>
            <p>{address.neighborhood}</p>
            <p>
              {address.city} — {address.state}
            </p>
            <p>CEP: {address.zipCode}</p>
          </CardContent>
        </Card>

        {/* Status de rastreamento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Acompanhamento</CardTitle>
          </CardHeader>
          <CardContent>
            {order.status === "CANCELED" ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="h-3 w-3 rounded-full bg-destructive shrink-0" />
                <span className="text-sm font-medium text-destructive">
                  Pedido cancelado
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {(
                  [
                    { status: "PENDING", label: "Pedido recebido" },
                    { status: "CONFIRMED", label: "Pedido confirmado" },
                    { status: "PREPARING", label: "Em preparo" },
                    { status: "OUT_FOR_DELIVERY", label: "Saiu para entrega" },
                    { status: "COMPLETED", label: "Entregue" },
                  ] as const
                ).map(({ status, label }) => {
                  const statuses: OrderStatus[] = [
                    "PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED",
                  ];
                  const currentIdx = statuses.indexOf(order.status as OrderStatus);
                  const stepIdx = statuses.indexOf(status);
                  const done = currentIdx >= stepIdx;
                  const current = currentIdx === stepIdx;

                  return (
                    <div key={status} className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full shrink-0 ${
                          done ? "bg-primary" : "bg-muted"
                        } ${current ? "ring-2 ring-primary ring-offset-1" : ""}`}
                      />
                      <span
                        className={`text-sm ${
                          done ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
