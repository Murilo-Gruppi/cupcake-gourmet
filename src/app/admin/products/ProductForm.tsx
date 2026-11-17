"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string | null;
    categoryId: string;
    active: boolean;
  };
}

type FieldErrors = Record<string, string[]>;

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      description: form.get("description") as string,
      price: parseFloat(form.get("price") as string),
      imageUrl: (form.get("imageUrl") as string) || undefined,
      categoryId,
      ...(isEditing ? { active: form.get("active") === "true" } : {}),
    };

    const url = isEditing
      ? `/api/admin/products/${initialData!.id}`
      : "/api/admin/products";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (res.status === 422 && json.details) {
        setFieldErrors(json.details as FieldErrors);
      } else {
        setError(json.error ?? "Erro ao salvar produto.");
      }
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          placeholder="Ex: Chocolate Belga"
          required
          disabled={loading}
        />
        {fieldErrors.name && (
          <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
          placeholder="Descreva o sabor, recheio e cobertura..."
          rows={4}
          required
          disabled={loading}
        />
        {fieldErrors.description && (
          <p className="text-xs text-destructive">{fieldErrors.description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={initialData?.price}
            placeholder="0,00"
            required
            disabled={loading}
          />
          {fieldErrors.price && (
            <p className="text-xs text-destructive">{fieldErrors.price[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Categoria *</Label>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            required
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.categoryId && (
            <p className="text-xs text-destructive">{fieldErrors.categoryId[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={initialData?.imageUrl ?? ""}
          placeholder="https://..."
          disabled={loading}
        />
        {fieldErrors.imageUrl && (
          <p className="text-xs text-destructive">{fieldErrors.imageUrl[0]}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading || !categoryId}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : isEditing ? (
            "Salvar alterações"
          ) : (
            "Criar produto"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
