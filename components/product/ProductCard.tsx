import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "./AddToCartButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl: string;
    storeName: string;
    merchantId: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const outOfStock = product.stock === 0;

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-sm px-3 py-1">
                Habis
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardHeader>
        <Link href={`/products/${product.slug}`}>
          <CardTitle className="line-clamp-2 text-sm leading-tight hover:text-primary">
            {product.name}
          </CardTitle>
        </Link>
        <Link
          href={`/merchants/${product.merchantId}`}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {product.storeName}
        </Link>
      </CardHeader>
      <CardContent>
        <span className="text-sm font-semibold text-primary">
          {formatRupiah(product.price)}
        </span>
      </CardContent>
      <CardFooter>
        {outOfStock ? (
          <Button disabled className="w-full" variant="secondary" size="sm">
            Stok Habis
          </Button>
        ) : (
          <AddToCartButton productId={product.id} stock={product.stock} />
        )}
      </CardFooter>
    </Card>
  );
}
