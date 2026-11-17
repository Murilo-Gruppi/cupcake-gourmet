"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Em produção, enviar para serviço de monitoramento (Sentry, etc.)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen gradient-cream flex flex-col items-center justify-center gap-6 p-4 text-center">
      <span className="text-8xl select-none">🫠</span>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Algo deu errado</h1>
        <p className="text-muted-foreground max-w-sm">
          Ocorreu um erro inesperado. Nossa equipe foi notificada. Tente
          novamente em alguns instantes.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono">
            ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Tentar novamente
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-1" />
            Ir para o início
          </Link>
        </Button>
      </div>
    </div>
  );
}
