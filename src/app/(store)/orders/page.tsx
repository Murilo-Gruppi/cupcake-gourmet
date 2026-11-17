import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { orderService } from "@/modules/orders/order.service";
import { OrderCard } from "@/components/orders/OrderCard";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Meus Pedidos" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/orders");

  const orders = await orderService.listUserOrders(session.user.id);

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {orders.length === 0
            ? "Nenhum pedido realizado ainda"
            : `${orders.length} pedido${orders.length !== 1 ? "s" : ""} no total`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
          <div className="space-y-1">
            <p className="font-semibold text-lg">Nenhum pedido ainda</p>
            <p className="text-muted-foreground text-sm">
              Que tal experimentar nossos cupcakes?
            </p>
          </div>
          <Button asChild>
            <Link href="/products">Ver cardápio</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
