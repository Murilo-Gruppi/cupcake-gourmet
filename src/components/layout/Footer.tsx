import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30 mt-auto">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧁</span>
              <div>
                <p className="font-bold text-primary">Cupcake Gourmet</p>
                <p className="text-xs text-muted-foreground">
                  Feito com amor e açúcar
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cupcakes artesanais com ingredientes selecionados, criados
              para adoçar seus momentos especiais.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Navegação</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-foreground transition-colors">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-foreground transition-colors">
                  Meus Pedidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Informações</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Encomendas para eventos</li>
              <li>Entrega local</li>
              <li>Pagamento demonstrativo</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Cupcake Gourmet. Projeto acadêmico —
          Engenharia de Software II.
        </p>
      </div>
    </footer>
  );
}
