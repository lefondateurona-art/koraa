"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { mockConversations, mockMessages, type MockMessage } from "@/lib/mock-data";
import { Icon } from "@/components/Icon";

export default function ChatPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;
  const conversation = mockConversations.find((c) => c.id === chatId);
  const [messages, setMessages] = useState<MockMessage[]>(
    mockMessages.filter((m) => m.chatId === chatId)
  );
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Realtime wiring: subscribes to INSERTs on `messages` for this chat.
  // No-ops gracefully until real Supabase env vars + table exist.
  useEffect(() => {
    let channel: ReturnType<ReturnType<typeof createClient>["channel"]> | null = null;
    try {
      const supabase = createClient();
      channel = supabase
        .channel(`messages:${chatId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${chatId}` },
          (payload) => {
            const row = payload.new as { id: string; author_id: string; content: string; created_at: string };
            setMessages((prev) => [
              ...prev,
              { id: row.id, chatId, author: "them", text: row.content, time: row.created_at },
            ]);
          }
        )
        .subscribe();
    } catch {
      // Supabase not configured yet — chat still renders with mock data.
    }
    return () => {
      channel?.unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, chatId, author: "me", text: draft.trim(), time: "maintenant" },
    ]);
    setDraft("");
    // TODO: supabase.from("messages").insert({ conversation_id: chatId, content: draft })
  }

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <header className="flex-none flex items-center gap-3 px-4 py-3 border-b border-line">
        <Link href="/messages" aria-label="Retour">
          <Icon name="chevron-left" size={20} />
        </Link>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-beige to-gold-dark flex items-center justify-center font-display font-extrabold text-white text-[13px]">
          {(conversation?.name ?? "?").charAt(0)}
        </div>
        <p className="font-semibold text-[14px]">{conversation?.name ?? "Conversation"}</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.author === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-3.5 py-2.5 rounded-md2 text-[13.5px] ${
                m.author === "me" ? "bg-gold text-white" : "bg-beige-light text-ink"
              }`}
            >
              {m.text}
              <div className={`text-[10px] mt-1 ${m.author === "me" ? "text-white/70" : "text-grey-soft"}`}>
                {m.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="chat-inputbar flex-none flex gap-2.5 items-center px-3.5 py-2.5 border-t border-line bg-white">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Écris un message..."
          className="flex-1 px-4 py-2.5 rounded-full bg-beige-light border border-line text-[13.5px] outline-none"
        />
        <button type="submit" className="btn-gold w-10 h-10 rounded-full flex items-center justify-center flex-none">
          <Icon name="send" size={16} />
        </button>
      </form>
    </main>
  );
}
