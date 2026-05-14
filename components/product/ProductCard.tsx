import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
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
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 shadow">
                Stok Habis
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-2.5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <Link
          href={`/merchants/${product.merchantId}`}
          className="mt-0.5 block truncate text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
        >
          {product.storeName}
        </Link>

        <div className="mt-2 flex items-end justify-between gap-1">
          <p className="text-sm font-bold text-primary leading-tight">
            {formatRupiah(product.price)}
          </p>
          {!outOfStock && (
            <AddToCartButton
              productId={product.id}
              stock={product.stock}
              iconOnly
            />
          )}
        </div>
      </div>
    </div>
  );
}
