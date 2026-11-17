"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[StoreError]", error);
  }, [error]);

  return (
    <div className="container py-16 flex flex-col items-center gap-4 text-center">
      <span className="text-5xl">😕</span>
      <div className="space-y-1">
        <p className="font-semibold text-lg">Ops, algo deu errado</p>
        <p className="text-sm text-muted-foreground">
          {error.message || "Ocorreu um erro inesperado. Tente novamente."}
        </p>
      </div>
      <Button onClick={reset} size="sm">
        <RefreshCw className="h-4 w-4 mr-1" />
        Tentar novamente
      </Button>
    </div>
  );
}
