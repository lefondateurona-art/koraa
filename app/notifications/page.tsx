"use client";

import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { mockNotifications } from "@/lib/mock-data";

/** Faithful port of the prototype NOTIFICATIONS view (renderNotifications). */
export default function NotificationsView() {
  const router = useRouter();
  const notifs = mockNotifications;

  return (
    <section id="view-notifications" className="view active">
      <div className="topbar">
        <button className="icon-btn" onClick={() => router.push("/")}>
          <Icon name="chevLeft" size={18} />
        </button>
        <div className="brand">Notifications</div>
      </div>
      <div className="view-scroll">
        {notifs.length ? (
          notifs.map((n) => (
            <div key={n.id} className={`notif-row ${n.read ? "" : "unread"}`}>
              <div className="nr-icon">
                <Icon name={(n.icon as IconName) || "bell"} size={17} />
              </div>
              <div>
                <div className="nr-text">{n.text}</div>
                <div className="nr-time">{n.time}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Icon name="bell" size={30} />
            <p>Aucune notification.</p>
          </div>
        )}
      </div>
    </section>
  );
}
