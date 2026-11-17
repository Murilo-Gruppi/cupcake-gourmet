"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2, CreditCard, Landmark, Banknote } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CheckoutFormProps {
  userId: string;
}

type FieldErrors = Record<string, string[] | Record<string, string[]>>;

const PAYMENT_METHODS = [
  { id: "demo", label: "Cartão (simulado)", icon: CreditCard },
  { id: "demo_pix", label: "Pix (simulado)", icon: Landmark },
  { id: "demo_boleto", label: "Boleto (simulado)", icon: Banknote },
];

function formatZipCode(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}

export function CheckoutForm({ userId: _ }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [paymentMethod, setPaymentMethod] = useState("demo");
  const [zipCode, setZipCode] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const body = {
      deliveryAddress: {
        street: form.get("street") as string,
        number: form.get("number") as string,
        complement: (form.get("complement") as string) || undefined,
        neighborhood: form.get("neighborhood") as string,
        city: form.get("city") as string,
        state: form.get("state") as string,
        zipCode,
      },
      paymentMethod,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (res.status === 422 && json.details) {
        setFieldErrors(json.details as FieldErrors);
        setError("Verifique os campos destacados.");
      } else {
        setError(json.error ?? "Erro ao finalizar pedido. Tente novamente.");
      }
      return;
    }

    router.push(`/orders/${json.data.id}?success=true`);
  }

  function getFieldError(path: string): string | undefined {
    const parts = path.split(".");
    let cur: FieldErrors | string[] | string | undefined = fieldErrors;
    for (const part of parts) {
      if (!cur || typeof cur === "string") return undefined;
      cur = (cur as FieldErrors)[part] as FieldErrors | string[];
    }
    if (Array.isArray(cur)) return cur[0];
    return undefined;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Endereço */}
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-lg">Endereço de Entrega</h2>
          <p className="text-sm text-muted-foreground">Onde devemos entregar?</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="street">Logradouro *</Label>
            <Input id="street" name="street" placeholder="Rua, Av., Alameda..." required disabled={loading} />
            {getFieldError("deliveryAddress.street") && (
              <p className="text-xs text-destructive">{getFieldError("deliveryAddress.street")}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="number">Número *</Label>
            <Input id="number" name="number" placeholder="123" required disabled={loading} />
            {getFieldError("deliveryAddress.number") && (
              <p className="text-xs text-destructive">{getFieldError("deliveryAddress.number")}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" name="complement" placeholder="Apto, bloco, casa..." disabled={loading} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input id="neighborhood" name="neighborhood" placeholder="Centro" required disabled={loading} />
            {getFieldError("deliveryAddress.neighborhood") && (
              <p className="text-xs text-destructive">{getFieldError("deliveryAddress.neighborhood")}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="zipCode">CEP *</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(formatZipCode(e.target.value))}
              placeholder="00000-000"
              maxLength={9}
              required
              disabled={loading}
            />
            {getFieldError("deliveryAddress.zipCode") && (
              <p className="text-xs text-destructive">{getFieldError("deliveryAddress.zipCode")}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="city">Cidade *</Label>
            <Input id="city" name="city" placeholder="São Paulo" required disabled={loading} />
            {getFieldError("deliveryAddress.city") && (
              <p className="text-xs text-destructive">{getFieldError("deliveryAddress.city")}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">Estado *</Label>
            <Input id="state" name="state" placeholder="SP" maxLength={2} required disabled={loading} />
            {getFieldError("deliveryAddress.state") && (
              <p className="text-xs text-destructive">{getFieldError("deliveryAddress.state")}</p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Pagamento */}
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold text-lg">Forma de Pagamento</h2>
          <p className="text-sm text-muted-foreground">
            Modo demonstrativo — nenhum valor real é cobrado
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPaymentMethod(id)}
              disabled={loading}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border text-sm font-medium transition-all text-left",
                paymentMethod === id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-muted-foreground/50 text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </section>

      <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processando pedido...
          </>
        ) : (
          "Confirmar e Pagar"
        )}
      </Button>
    </form>
  );
}
