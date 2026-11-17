import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cartService } from "@/modules/cart/cart.service";
import { CheckoutForm } from "./CheckoutForm";
import { formatCurrency } from "@/lib/utils/format";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/checkout");

  const cart = await cartService.getCart(session.user.id);
  if (cart.items.length === 0) redirect("/cart");

  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Formulário — ocupa mais espaço */}
        <div className="lg:col-span-3">
          <CheckoutForm userId={session.user.id} />
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-5 space-y-4 sticky top-24">
            <h2 className="font-semibold">Resumo do Pedido</h2>

            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-secondary/50">
                    {item.productImageUrl ? (
                      <Image
                        src={item.productImageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🧁</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}× {formatCurrency(item.productPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Entrega</span>
                <span className="text-green-600 font-medium">Grátis</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary text-lg">{formatCurrency(cart.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
