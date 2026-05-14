"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiSuccess } from "@/types";

interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
}

export function CategoryNav() {
  const pathname = usePathname();

  const { data, isLoading, error } = useQuery<ApiSuccess<Category[]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Gagal memuat kategori");
      return res.json();
    },
  });

  const categories = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  if (error || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const href = `/categories/${category.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={category.id}
            href={href}
            className={cn(
              "inline-flex shrink-0 items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            )}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
