import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-cream flex flex-col items-center justify-center gap-6 p-4 text-center">
      <span className="text-8xl select-none">🧁</span>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl font-semibold">Página não encontrada</p>
        <p className="text-muted-foreground max-w-sm">
          Ops! Parece que este cupcake sumiu do cardápio. A página que você
          procura não existe ou foi removida.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-1" />
            Ir para o início
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">
            <Search className="h-4 w-4 mr-1" />
            Ver cardápio
          </Link>
        </Button>
      </div>
    </div>
  );
}
