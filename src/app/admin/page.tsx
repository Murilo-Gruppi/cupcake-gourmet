import type { Metadata } from "next";
import { orderService } from "@/modules/orders/order.service";
import { productService } from "@/modules/products/product.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import { TrendingUp, ShoppingBag, Package, DollarSign } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard Admin" };

export default async function AdminDashboardPage() {
  const [stats, products] = await Promise.all([
    orderService.getDashboardStats(),
    productService.listProductsAdmin({ limit: 1 }),
  ]);

  const cards = [
    {
      title: "Receita do Dia",
      value: formatCurrency(stats.revenueToday),
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      title: "Receita do Mês",
      value: formatCurrency(stats.revenueMonth),
      icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Total de Pedidos",
      value: String(stats.totalOrders),
      icon: <ShoppingBag className="h-5 w-5 text-primary" />,
      bg: "bg-primary/5",
    },
    {
      title: "Produtos Cadastrados",
      value: String(products.total),
      icon: <Package className="h-5 w-5 text-amber-600" />,
      bg: "bg-amber-50",
    },
  ];

  const statusLabels: Record<string, string> = {
    PENDING: "Pendentes",
    CONFIRMED: "Confirmados",
    PREPARING: "Em preparo",
    OUT_FOR_DELIVERY: "Em entrega",
    COMPLETED: "Concluídos",
    CANCELED: "Cancelados",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Visão geral da operação
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${card.bg}`}>{card.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  {card.title}
                </p>
                <p className="text-xl font-bold leading-tight">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pedidos por status */}
      {stats.totalOrders > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pedidos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-sm text-muted-foreground">
                    {statusLabels[status] ?? status}
                  </span>
                  <span className="font-bold text-sm">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.totalOrders === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>Nenhum pedido ainda. Aguarde os primeiros clientes!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
