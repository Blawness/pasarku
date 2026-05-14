"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartDrawer, useAddToCart } from "@/stores/cartStore";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const openDrawer = useCartDrawer((s) => s.open);
  const setAdding = useAddToCart((s) => s.setAdding);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Gagal menambahkan ke keranjang");
      }
      return res.json();
    },
    onMutate: () => {
      setAdding(productId);
    },
    onSuccess: () => {
      toast.success("Berhasil ditambahkan ke keranjang");
      openDrawer();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menambahkan ke keranjang");
    },
    onSettled: () => {
      setAdding(null);
    },
  });

  const isAdding = mutation.isPending;

  return (
    <Button
      onClick={() => mutation.mutate()}
      disabled={isAdding}
      className="w-full"
      size="sm"
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Tambah
    </Button>
  );
}
