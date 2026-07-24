"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { mockNotifications, type MockNotification } from "@/lib/mock-data";
import { Icon } from "@/components/Icon";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications);

  // Realtime wiring: subscribes to INSERTs on `notifications` for this user.
  // No-ops gracefully until real Supabase env vars + table exist.
  useEffect(() => {
    let channel: ReturnType<ReturnType<typeof createClient>["channel"]> | null = null;
    try {
      const supabase = createClient();
      channel = supabase
        .channel("notifications:self")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload) => {
            const row = payload.new as { id: string; title: string; body: string; created_at: string };
            setNotifications((prev) => [
              { id: row.id, title: row.title, body: row.body, time: row.created_at, read: false },
              ...prev,
            ]);
          }
        )
        .subscribe();
    } catch {
      // Supabase not configured yet.
    }
    return () => {
      channel?.unsubscribe();
    };
  }, []);

  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <header className="flex-none px-4 pt-5 pb-3">
        <h1 className="text-[22px]">Notifications</h1>
      </header>

      {notifications.length === 0 && <p className="empty-state">Aucune notification.</p>}

      <div>
        {notifications.map((n) => (
          <div key={n.id} className={`notif-row flex gap-3 px-[18px] py-3.5 border-b border-line ${!n.read ? "bg-beige-light/40" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gold-soft flex items-center justify-center text-gold-dark flex-none">
              <Icon name="bell" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[13.5px] font-semibold">{n.title}</p>
              <p className="text-[12.5px] text-grey-soft">{n.body}</p>
              <p className="nr-time text-[11px] text-grey-soft mt-0.5">{n.time}</p>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full bg-gold-dark flex-none mt-1.5" />}
          </div>
        ))}
      </div>
    </main>
  );
}
