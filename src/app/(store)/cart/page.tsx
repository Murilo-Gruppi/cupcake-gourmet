import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { cartService } from "@/modules/cart/cart.service";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Carrinho" };

export default async function CartPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="container py-16 flex flex-col items-center gap-6 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/40" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground">
            Faça login para ver ou salvar seus itens.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/products">Ver produtos</Link>
          </Button>
          <Button asChild>
            <Link href="/login?callbackUrl=/cart">Entrar</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cart = await cartService.getCart(session.user.id);

  if (cart.items.length === 0) {
    return (
      <div className="container py-16 flex flex-col items-center gap-6 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground/40" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground">
            Adicione alguns cupcakes deliciosos!
          </p>
        </div>
        <Button asChild>
          <Link href="/products">
            Ver produtos <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">
        Carrinho ({cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itens */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card px-6">
            {cart.items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Resumo */}
        <div>
          <CartSummary total={cart.total} itemCount={cart.itemCount} />
        </div>
      </div>
    </div>
  );
}
