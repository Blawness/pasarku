"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const banners = [
  {
    id: 1,
    gradient: "from-emerald-700 via-green-600 to-teal-500",
    title: "Belanja Lebih Hemat",
    subtitle: "Grocery segar diantar dalam 10–30 menit",
    badge: "Gratis Ongkir",
    badgeClass: "bg-yellow-400 text-yellow-900",
    emoji: "🥦",
  },
  {
    id: 2,
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    title: "Promo Akhir Pekan",
    subtitle: "Diskon s/d 40% untuk produk pilihan",
    badge: "Terbatas",
    badgeClass: "bg-white/25 text-white",
    emoji: "🍎",
  },
  {
    id: 3,
    gradient: "from-teal-600 via-emerald-500 to-green-400",
    title: "Langsung dari Petani",
    subtitle: "Produk segar dipanen hari ini",
    badge: "100% Segar",
    badgeClass: "bg-white/25 text-white",
    emoji: "🌽",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % banners.length),
    []
  );

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const handlePointerDown = (e: React.PointerEvent) => setStartX(e.clientX);
  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX === null) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 40) {
      setCurrent((c) =>
        delta < 0
          ? (c + 1) % banners.length
          : (c - 1 + banners.length) % banners.length
      );
    }
    setStartX(null);
  };

  return (
    <div
      className="relative overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={cn(
              "relative flex w-full shrink-0 flex-col justify-center overflow-hidden bg-gradient-to-r px-6 py-7",
              banner.gradient
            )}
            style={{ minWidth: "100%" }}
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -right-4 bottom-0 size-28 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute right-16 -bottom-6 size-16 rounded-full bg-white/10" />

            {/* Emoji */}
            <span
              className="absolute right-8 top-1/2 -translate-y-1/2 text-6xl opacity-30 select-none pointer-events-none"
              aria-hidden
            >
              {banner.emoji}
            </span>

            <span
              className={cn(
                "mb-2 inline-block self-start rounded-full px-2.5 py-0.5 text-xs font-semibold",
                banner.badgeClass
              )}
            >
              {banner.badge}
            </span>
            <h2 className="text-xl font-extrabold text-white leading-tight drop-shadow-sm">
              {banner.title}
            </h2>
            <p className="mt-1 text-sm text-white/80">{banner.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/50"
            )}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
