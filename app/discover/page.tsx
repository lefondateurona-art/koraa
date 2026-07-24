import Link from "next/link";
import { mockPosts, mockShops, mockCategories } from "@/lib/mock-data";
import { Icon } from "@/components/Icon";

export default function DiscoverPage() {
  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <header className="flex-none px-4 pt-5 pb-3">
        <h1 className="text-[22px]">Découvrir</h1>
        <Link
          href="/search"
          className="mt-3 flex items-center gap-2 px-4 py-3 rounded-md2 bg-beige-light text-grey-soft text-[13.5px]"
        >
          <Icon name="search" size={17} />
          Rechercher créateurs, boutiques, produits...
        </Link>
      </header>

      <div className="flex-none flex gap-2 px-4 pb-3 overflow-x-auto">
        {mockCategories.map((cat, i) => (
          <span key={cat} className={`chip ${i === 0 ? "active" : ""}`}>
            {cat}
          </span>
        ))}
      </div>

      <section className="px-4 pb-3">
        <h2 className="text-[15px] mb-2">Boutiques populaires</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {mockShops.map((shop) => (
            <Link
              key={shop.id}
              href={`/shop/${shop.id}`}
              className="flex-none w-[150px] rounded-lg2 overflow-hidden bg-white border border-line shadow-card"
            >
              <div className="h-24 bg-gradient-to-br from-beige to-gold-dark" />
              <div className="p-3">
                <p className="font-display font-bold text-[13.5px] truncate">{shop.name}</p>
                <p className="text-[11px] text-grey-soft mb-2">{shop.category}</p>
                <div className="flex gap-2.5 text-[10.5px] text-grey-soft">
                  <span>{shop.followers.toLocaleString("fr-FR")} abonnés</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pb-6 grid grid-cols-2 gap-3">
        {mockPosts.concat(mockPosts).map((post, i) => (
          <Link
            key={`${post.id}-${i}`}
            href={`/shop/${post.shopId}`}
            className="rounded-lg2 overflow-hidden bg-white border border-line shadow-card"
          >
            <div className="h-40 bg-gradient-to-br from-beige-light to-beige flex items-center justify-center text-[11px] text-grey-soft">
              {post.thumbnailLabel}
            </div>
            <div className="p-2.5">
              <p className="text-[12.5px] font-semibold truncate">{post.productName}</p>
              <p className="text-[11px] text-grey-soft">{post.creatorHandle}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
