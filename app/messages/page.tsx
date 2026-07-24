"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { mockConversations, initials, gradFor } from "@/lib/mock-data";

/** Faithful port of the prototype MESSAGES view (renderMessages / convRowHTML). */
export default function MessagesView() {
  const router = useRouter();
  const convs = mockConversations;

  return (
    <section id="view-messages" className="view active">
      <div className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          Messages
        </div>
      </div>
      <div className="view-scroll">
        {convs.length ? (
          convs.map((c) => (
            <div
              key={c.id}
              className="conv-row"
              style={{ cursor: "pointer" }}
              onClick={() => router.push(`/messages/${c.id}`)}
            >
              <div className="cv-avatar" style={{ background: gradFor(c.name) }}>
                {initials(c.name)}
              </div>
              <div className="cv-body">
                <div className="cv-top">
                  <span className="cv-name">{c.name}</span>
                  <span className="cv-time">{c.time}</span>
                </div>
                <div className="cv-preview">{c.preview}</div>
              </div>
              {c.unread ? <span className="cv-unread" /> : null}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Icon name="message" size={32} />
            <p>Aucune conversation pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
