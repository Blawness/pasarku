"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
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

const CIRCLE_BG = [
  "bg-green-100",
  "bg-orange-100",
  "bg-sky-100",
  "bg-yellow-100",
  "bg-red-100",
  "bg-purple-100",
  "bg-cyan-100",
  "bg-pink-100",
  "bg-lime-100",
  "bg-amber-100",
  "bg-indigo-100",
  "bg-rose-100",
];

const CATEGORY_EMOJI: Record<string, string> = {
  sayur: "🥬",
  buah: "🍎",
  daging: "🥩",
  seafood: "🐟",
  ikan: "🐟",
  unggas: "🍗",
  ayam: "🍗",
  bakery: "🥖",
  roti: "🥖",
  protein: "🥚",
  telur: "🥚",
  susu: "🥛",
  dairy: "🥛",
  minuman: "🧃",
  snack: "🍪",
  frozen: "🧊",
  beku: "🧊",
  bumbu: "🌿",
  beras: "🍚",
  minyak: "🫙",
  pasta: "🍝",
};

function getCategoryEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return "🛒";
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
      <div className="flex gap-4 overflow-x-auto px-4 pb-3 scrollbar-hide">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className="flex shrink-0 flex-col items-center gap-2 w-[60px]"
          >
            <Skeleton className="size-14 rounded-full" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error || categories.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-hide">
      {categories.map((category, index) => {
        const href = `/categories/${category.slug}`;
        const isActive = pathname === href;
        const bg = CIRCLE_BG[index % CIRCLE_BG.length];
        const emoji = getCategoryEmoji(category.name);

        return (
          <Link
            key={category.id}
            href={href}
            className="flex w-[60px] shrink-0 flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                "relative flex size-14 items-center justify-center overflow-hidden rounded-full transition-all",
                bg,
                isActive
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:ring-2 hover:ring-primary/30 hover:ring-offset-1"
              )}
            >
              {category.iconUrl ? (
                <Image
                  src={category.iconUrl}
                  alt={category.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <span
                  className="text-2xl leading-none"
                  role="img"
                  aria-label={category.name}
                >
                  {emoji}
                </span>
              )}
            </div>
            <span
              className={cn(
                "line-clamp-2 text-center text-[11px] font-medium leading-tight",
                isActive ? "text-primary" : "text-gray-600"
              )}
            >
              {category.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
