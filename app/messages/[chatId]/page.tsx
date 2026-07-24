"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import {
  mockConversations,
  mockMessages,
  shopOf,
  initials,
  gradFor,
  type MockMessage,
} from "@/lib/mock-data";

/** Faithful port of the prototype CHAT view (renderChat). */
export default function ChatView({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  const router = useRouter();

  const conv = mockConversations.find((c) => c.id === chatId);
  const shop = shopOf(chatId);
  const title = conv?.name ?? shop?.name ?? "Conversation";
  const color = gradFor(title);

  const [messages, setMessages] = useState<MockMessage[]>(
    mockMessages.filter((m) => m.chatId === chatId)
  );
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  function send() {
    const val = draft.trim();
    if (!val) return;
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, chatId, mine: true, text: val, time: "maintenant" },
    ]);
    setDraft("");
    // Simulated shop assistant reply (matches prototype behaviour).
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}-ai`,
          chatId,
          mine: false,
          text: `🤖 Assistant ${title} — Merci pour ton message ! Un vendeur va te répondre très vite.`,
          time: "maintenant",
        },
      ]);
    }, 800);
  }

  return (
    <section id="view-chat" className="view active">
      <div className="topbar">
        <button className="icon-btn" onClick={() => router.push("/messages")}>
          <Icon name="chevLeft" size={18} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            className="cv-avatar"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {initials(title)}
          </div>
          <div className="brand" style={{ fontSize: 15 }}>
            {title}
          </div>
        </div>
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {messages.map((m) => (
          <div key={m.id} className={`msg-bubble ${m.mine ? "mine" : "theirs"}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-inputbar">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écrire un message..."
        />
        <button className="send-btn" onClick={send}>
          <Icon name="send" size={18} />
        </button>
      </div>
    </section>
  );
}
