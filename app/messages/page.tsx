import Link from "next/link";
import { mockConversations } from "@/lib/mock-data";

export default function MessagesPage() {
  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <header className="flex-none px-4 pt-5 pb-3">
        <h1 className="text-[22px]">Messages</h1>
      </header>

      <div className="flex-1">
        {mockConversations.length === 0 && (
          <p className="empty-state">Aucune conversation pour le moment.</p>
        )}
        {mockConversations.map((c) => (
          <Link
            key={c.id}
            href={`/messages/${c.id}`}
            className="conv-row flex items-center gap-3 px-[18px] py-3 border-b border-line"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-beige to-gold-dark flex-none flex items-center justify-center font-display font-extrabold text-white">
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[13.5px] truncate">{c.name}</p>
                <span className="cv-time text-[11px] text-grey-soft">{c.time}</span>
              </div>
              <p className="cv-preview text-[12.5px] text-grey-soft truncate max-w-[220px]">{c.preview}</p>
            </div>
            {c.unread > 0 && (
              <span className="w-5 h-5 rounded-full bg-gold-dark text-white text-[10.5px] font-bold flex items-center justify-center flex-none">
                {c.unread}
              </span>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
