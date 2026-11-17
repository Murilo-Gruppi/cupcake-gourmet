import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/format";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface CartSummaryProps {
  total: number;
  itemCount: number;
}

export function CartSummary({ total, itemCount }: CartSummaryProps) {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4 sticky top-24">
      <h2 className="font-semibold text-lg">Resumo do Pedido</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Entrega</span>
          <span className="text-green-600 font-medium">Grátis</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-base">
        <span>Total</span>
        <span className="text-primary text-lg">{formatCurrency(total)}</span>
      </div>

      <Button size="lg" className="w-full rounded-full" asChild>
        <Link href="/checkout">
          Finalizar Pedido <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>

      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link href="/products">
          <ShoppingBag className="h-4 w-4 mr-1" />
          Continuar comprando
        </Link>
      </Button>
    </div>
  );
}
