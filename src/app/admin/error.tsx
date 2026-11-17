"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("[AdminError]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="text-4xl">⚠️</span>
      <div className="space-y-1">
        <p className="font-semibold text-lg">Erro no painel administrativo</p>
        <p className="text-sm text-muted-foreground">
          {error.message || "Ocorreu um erro inesperado."}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={reset}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Tentar novamente
        </Button>
        <Button size="sm" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
      </div>
    </div>
  );
}
