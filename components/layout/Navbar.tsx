"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = (session?.user as Record<string, unknown>)?.role as
    | string
    | undefined;

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    },
    enabled: !!session,
  });

  const cartCount =
    (cartData?.items as Array<{ quantity: number }> | undefined)?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) ?? 0;

  return (
    <nav className="sticky top-0 z-40 w-full bg-primary shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-lg font-extrabold tracking-tight text-white"
          >
            Pasarku
          </Link>

          {/* Search — desktop only */}
          <form
            className="hidden flex-1 sm:block"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const q = fd.get("q")?.toString().trim();
              if (q) router.push(`/?q=${encodeURIComponent(q)}`);
            }}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                name="q"
                type="search"
                placeholder="Cari beragam kebutuhan harian"
                className="pl-9 rounded-full border-0 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-white/40"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1">
            {/* Cart — desktop only (mobile uses BottomNav) */}
            <Link href="/cart" className="relative hidden sm:inline-flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/15"
              >
                <ShoppingCart className="size-5" />
                <span className="sr-only">Keranjang</span>
              </Button>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none pointer-events-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User — desktop only */}
            <div className="hidden sm:flex items-center gap-1">
              {status === "loading" ? (
                <div className="size-8 animate-pulse rounded-full bg-white/20" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/15"
                      />
                    }
                  >
                    <User className="size-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="truncate px-2 py-1.5 text-sm font-medium">
                      {session.user?.name}
                    </div>
                    <DropdownMenuSeparator />
                    {role === "BUYER" && (
                      <>
                        <DropdownMenuItem render={<Link href="/orders" />}>
                          Pesanan Saya
                        </DropdownMenuItem>
                        <DropdownMenuItem render={<Link href="/profile" />}>
                          Profil
                        </DropdownMenuItem>
                      </>
                    )}
                    {role === "MERCHANT" && (
                      <DropdownMenuItem
                        render={<Link href="/merchant/dashboard" />}
                      >
                        Dashboard Merchant
                      </DropdownMenuItem>
                    )}
                    {role === "ADMIN" && (
                      <DropdownMenuItem render={<Link href="/admin" />}>
                        Dashboard Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-white/15"
                    render={<Link href="/login" />}
                  >
                    Masuk
                  </Button>
                  <Button
                    className="bg-white text-primary hover:bg-white/90 font-semibold"
                    render={<Link href="/register" />}
                  >
                    Daftar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
