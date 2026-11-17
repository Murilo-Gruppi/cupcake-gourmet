import Link from "next/link";
import { ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🧁</span>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-primary text-lg tracking-tight">
              Cupcake
            </span>
            <span className="text-xs text-muted-foreground font-medium -mt-0.5">
              Gourmet
            </span>
          </div>
        </Link>

        {/* Navegação central — oculto em mobile */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Início
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cardápio
          </Link>
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2">
          {/* Menu mobile */}
          <MobileNav
            userName={session?.user?.name?.split(" ")[0]}
            isAdmin={session?.user?.role === "ADMIN"}
          />
          {/* Carrinho */}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Carrinho">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>

          {session ? (
            <div className="hidden md:flex items-center gap-1">
              {/* Admin link */}
              {session.user.role === "ADMIN" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin" className="gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              )}

              {/* Pedidos */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/orders">
                  <User className="h-4 w-4 mr-1" />
                  <span>{session.user.name.split(" ")[0]}</span>
                </Link>
              </Button>

              {/* Logout */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button variant="ghost" size="icon" type="submit" aria-label="Sair">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
