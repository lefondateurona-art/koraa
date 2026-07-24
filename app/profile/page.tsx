"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { fmtFCFA } from "@/lib/mock-data";

const TABS = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "content", label: "Contenu" },
  { id: "history", label: "Historique" },
  { id: "settings", label: "Paramètres" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const dashStats = [
  { label: "Abonnés", value: "1.2k" },
  { label: "Vidéos", value: "34" },
  { label: "Ventes", value: "212" },
];

const historyOrders = [
  { productName: "Robe wax imprimée", shopName: "Adama Boutique", price: 15000, status: "Livré" },
  { productName: "Écouteurs sans fil", shopName: "TechHub CI", price: 12500, status: "En cours" },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<TabId>("dashboard");

  return (
    <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <header className="profile-hero flex-none px-4 pt-6 pb-4 flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-beige to-gold-dark flex items-center justify-center font-display font-extrabold text-white text-xl">
          E
        </div>
        <div>
          <h1 className="text-[18px]">Elijah Koffi</h1>
          <p className="ph-handle text-[12.5px] text-grey-soft">@elijah.koffi</p>
        </div>
      </header>

      <div className="profile-tabs flex-none flex px-3.5 border-b border-line overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`profile-tab flex-none text-center px-3 py-3 text-[12.5px] font-bold border-b-[2.5px] whitespace-nowrap ${
              tab === t.id ? "border-gold-dark text-ink" : "border-transparent text-grey-soft"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {tab === "dashboard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {dashStats.map((s) => (
                <div key={s.label} className="stat-tile text-center">
                  <div className="font-display font-extrabold text-[16px]">{s.value}</div>
                  <div className="text-[11px] text-grey-soft">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="dash-row">
              <div className="w-9 h-9 rounded-md2 bg-beige-light flex items-center justify-center text-gold-dark">
                <Icon name="grid" size={16} />
              </div>
              <div className="dr-label flex-1 text-[13px] text-grey">Gérer ma boutique</div>
              <Icon name="chevron-right" size={16} className="text-grey-soft" />
            </div>
          </div>
        )}

        {tab === "content" && (
          <p className="empty-state">Aucun contenu publié pour le moment.</p>
        )}

        {tab === "history" && (
          <div className="space-y-0">
            {historyOrders.map((o) => (
              <div key={o.productName} className="history-row flex justify-between items-center py-2.5 border-b border-line text-[12.5px]">
                <div>
                  <p className="font-semibold">{o.productName}</p>
                  <p className="text-grey-soft">{o.shopName}</p>
                </div>
                <div className="text-right">
                  <p>{fmtFCFA(o.price)}</p>
                  <span className="hr-tag text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-beige-light text-grey-soft">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "settings" && (
          <div>
            {["Notifications", "Confidentialité", "Langue", "Aide", "Se déconnecter"].map((label) => (
              <div key={label} className="settings-row flex items-center justify-between py-3.5 border-b border-line text-[13.5px]">
                <span>{label}</span>
                <Icon name={label === "Se déconnecter" ? "logout" : "chevron-right"} size={16} className="text-grey-soft" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
