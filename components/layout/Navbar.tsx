"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = (session?.user as Record<string, unknown>)?.role as string | undefined;

  return (
    <nav className="sticky top-0 z-40 w-full bg-background shadow-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-heading text-lg font-semibold">
            Pasarku
          </Link>

          <div className="hidden flex-1 max-w-md sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari sayur, buah, daging..."
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="size-5" />
                <span className="sr-only">Keranjang</span>
              </Button>
            </Link>

            {status === "loading" ? (
              <div className="size-8 animate-pulse rounded-full bg-muted" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" size="icon" />}
                >
                  <User className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium truncate">
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
                    <DropdownMenuItem render={<Link href="/merchant/dashboard" />}>
                      Dashboard Merchant
                    </DropdownMenuItem>
                  )}
                  {role === "ADMIN" && (
                    <DropdownMenuItem render={<Link href="/admin" />}>
                      Dashboard Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Button variant="ghost" render={<Link href="/login" />}>
                  Masuk
                </Button>
                <Button render={<Link href="/register" />}>
                  Daftar
                </Button>
              </div>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="sm:hidden" />}
              >
                {mobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 mt-4">
                  <div className="relative sm:hidden">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Cari..."
                      className="pl-8"
                    />
                  </div>
                  {status === "authenticated" ? (
                    <>
                      <div className="px-2 py-1 text-sm font-medium">
                        {session.user?.name}
                      </div>
                      {role === "BUYER" && (
                        <>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            render={<Link href="/orders" onClick={() => setMobileMenuOpen(false)} />}
                          >
                            Pesanan Saya
                          </Button>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            render={<Link href="/profile" onClick={() => setMobileMenuOpen(false)} />}
                          >
                            Profil
                          </Button>
                        </>
                      )}
                      {role === "MERCHANT" && (
                        <Button
                          variant="ghost"
                          className="justify-start"
                          render={<Link href="/merchant/dashboard" onClick={() => setMobileMenuOpen(false)} />}
                        >
                          Dashboard Merchant
                        </Button>
                      )}
                      {role === "ADMIN" && (
                        <Button
                          variant="ghost"
                          className="justify-start"
                          render={<Link href="/admin" onClick={() => setMobileMenuOpen(false)} />}
                        >
                          Dashboard Admin
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        Keluar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        render={<Link href="/login" onClick={() => setMobileMenuOpen(false)} />}
                      >
                        Masuk
                      </Button>
                      <Button
                        className="justify-start"
                        render={<Link href="/register" onClick={() => setMobileMenuOpen(false)} />}
                      >
                        Daftar
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
