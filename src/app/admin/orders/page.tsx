import type { Metadata } from "next";
import Link from "next/link";
import { orderService } from "@/modules/orders/order.service";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { Eye } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Pedidos — Admin" };

interface AdminOrdersPageProps {
  searchParams: { page?: string; status?: string };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const result = await orderService.listAllOrders({
    page: searchParams.page ? Number(searchParams.page) : 1,
    status: searchParams.status as OrderStatus | undefined,
    limit: 20,
  });

  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "PENDING", label: "Pendentes" },
    { value: "CONFIRMED", label: "Confirmados" },
    { value: "PREPARING", label: "Em Preparo" },
    { value: "OUT_FOR_DELIVERY", label: "Em Entrega" },
    { value: "COMPLETED", label: "Concluídos" },
    { value: "CANCELED", label: "Cancelados" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {result.total} pedido{result.total !== 1 ? "s" : ""} no total
          </p>
        </div>
      </div>

      {/* Filtro por status */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(({ value, label }) => (
          <Link
            key={value}
            href={`/admin/orders${value ? `?status=${value}` : ""}`}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              (searchParams.status ?? "") === value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:bg-muted border-border"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pedido</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Cliente</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Data</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Pagamento</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {result.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              result.items.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {(order as unknown as { user?: { name: string } }).user?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <OrderStatusBadge status={order.status as OrderStatus} />
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <PaymentStatusBadge status={order.paymentStatus as PaymentStatus} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/orders/${order.id}`} aria-label="Ver pedido">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?page=${p}${searchParams.status ? `&status=${searchParams.status}` : ""}`}
              className={`inline-flex items-center justify-center h-9 w-9 rounded-md border text-sm font-medium transition-colors ${
                (searchParams.page ? Number(searchParams.page) : 1) === p
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
