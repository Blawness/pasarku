import { eq, isNotNull, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productImages, categories, merchants } from "@/drizzle/schema";
import { CategoryNav } from "@/components/product/CategoryNav";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchBar } from "@/components/product/SearchBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search } from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;

  const [allCategories, allProducts] = await Promise.all([
    db.select().from(categories).orderBy(categories.name),
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        stock: products.stock,
        imageUrl: productImages.url,
        storeName: merchants.storeName,
        merchantId: merchants.id,
      })
      .from(products)
      .innerJoin(merchants, eq(products.merchantId, merchants.id))
      .leftJoin(
        productImages,
        and(
          eq(products.id, productImages.productId),
          eq(productImages.order, 0)
        )
      )
      .where(
        and(
          eq(products.isActive, true),
          isNotNull(productImages.url)
        )
      )
      .limit(20),
  ]);

  const productList = allProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    stock: p.stock,
    imageUrl: p.imageUrl ?? "/placeholder.svg",
    storeName: p.storeName,
    merchantId: p.merchantId,
  }));

  const filteredProducts = q
    ? productList.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase())
      )
    : productList;

  return (
    <div className="flex flex-col gap-6 py-6 px-4 sm:px-6 lg:px-8">
      <SearchBar className="w-full max-w-md mx-auto" />

      <section className="overflow-x-auto pb-1">
        <CategoryNav />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">
          {q ? `Hasil pencarian "${q}"` : "Produk Terbaru"}
        </h2>

        {q && filteredProducts.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Produk tidak ditemukan"
            description="Coba cari dengan kata kunci yang berbeda."
          />
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </section>
    </div>
  );
}
