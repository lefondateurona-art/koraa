import Link from "next/link";
import { mockPosts, fmtCompact } from "@/lib/mock-data";
import { Icon } from "@/components/Icon";

export default function FeedPage() {
  return (
    <main className="flex-1 flex flex-col min-h-0 bg-ink text-white">
      <header className="flex-none flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_0_4px_rgba(255,255,255,0.16)]" />
          <span className="font-display font-extrabold text-[15px] tracking-wide">KORAA</span>
        </div>
        <div className="flex gap-5 font-display font-bold text-[15px]">
          <span className="text-white/55">Abonnements</span>
          <span className="text-white relative after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[2.5px] after:bg-gold after:rounded">
            Pour toi
          </span>
        </div>
        <Link href="/notifications" aria-label="Notifications">
          <Icon name="bell" className="text-white" />
        </Link>
      </header>

      <section className="flex-1 overflow-y-auto snap-y snap-mandatory">
        {mockPosts.map((post) => (
          <article
            key={post.id}
            className="relative h-[calc(100dvh-140px)] min-h-[480px] snap-start flex items-end"
            style={{
              background:
                "linear-gradient(160deg, rgba(32,21,16,0.2), rgba(32,21,16,0.85)), linear-gradient(135deg, var(--beige), var(--gold-dark))",
            }}
          >
            <div className="w-full p-4 pb-6 flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[15px]">{post.creatorName}</p>
                <p className="text-white/70 text-[12.5px] mb-2">{post.creatorHandle}</p>
                <p className="text-[13.5px] leading-snug mb-3 line-clamp-2">{post.caption}</p>
                <div className="flex items-center gap-4 text-[12px] text-white/80">
                  <span className="flex items-center gap-1">
                    <Icon name="heart" size={16} /> {fmtCompact(post.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="message" size={16} /> {post.comments}
                  </span>
                </div>
              </div>
              <Link
                href={`/shop/${post.shopId}`}
                className="btn-gold flex-none px-5 py-3 rounded-full text-[13.5px] font-bold shadow-soft"
              >
                Commander
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
