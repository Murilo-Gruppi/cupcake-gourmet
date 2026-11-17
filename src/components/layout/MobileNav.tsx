"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, ShoppingBag, ShoppingCart, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MobileNavProps {
  userName?: string;
  isAdmin?: boolean;
}

const navLinks = [
  { href: "/", label: "Início", icon: Home },
  { href: "/products", label: "Cardápio", icon: ShoppingBag },
  { href: "/cart", label: "Carrinho", icon: ShoppingCart },
  { href: "/orders", label: "Meus Pedidos", icon: User },
];

export function MobileNav({ userName, isAdmin }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <nav
        className={cn(
          "fixed top-16 left-0 right-0 z-50 bg-white border-b shadow-lg transition-all duration-200 overflow-hidden",
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div className="container py-4 space-y-1">
          {userName && (
            <div className="px-3 py-2 mb-2 border-b">
              <p className="text-sm font-medium">Olá, {userName}! 👋</p>
            </div>
          )}

          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Painel Admin
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
