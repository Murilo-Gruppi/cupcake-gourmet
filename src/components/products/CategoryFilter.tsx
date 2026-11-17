"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("categoryId");

  function handleFilter(categoryId: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFilter(null)}
        className={cn(
          "rounded-full",
          !currentCategory && "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
        )}
      >
        Todos
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant="outline"
          size="sm"
          onClick={() => handleFilter(cat.id)}
          className={cn(
            "rounded-full",
            currentCategory === cat.id &&
              "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
          )}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}
