"use client"

import { Suspense, useState } from "react";
import { HeadbarComponent, TableSupervisionComponent, TabbarComponent } from "@components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave, faBell, faFileLines } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Link from "next/link";

const TAB_ITEMS = [
  { label: "Semua", value: "all" },
  { label: "Booking", value: "BOOKING" },
  { label: "Keuangan", value: "FINANCE" },
  { label: "Lainnya", value: "GENERAL" }
];

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Notifikasi" />

        <TableSupervisionComponent
          fetchControl={{
            path: "notifications",
            includeParams: activeTab !== "all" ? { type: activeTab } : {}
          }}
          columnControl={[
            {
              selector: "title",
              label: "Judul",
              item: (r) => r.notification?.title || "-",
              sortable: true
            },
            {
              selector: "body",
              label: "Pesan",
              item: (r) => r.notification?.body || "-",
              sortable: false
            },
            {
              selector: "created_at",
              label: "Tanggal",
              item: (r) => {
                if (!r.created_at) return "-";
                try {
                  return moment(r.created_at).format("DD MMM YYYY HH:mm");
                } catch {
                  return r.created_at;
                }
              },
              sortable: true
            },
          ]}
          controlBar={[
            <div key="tabs" className="py-1 w-full">
              <TabbarComponent 
                items={TAB_ITEMS} 
                active={activeTab} 
                onChange={(val) => setActiveTab(String(val))} 
              />
            </div>
          ]}
          detailControl={false}
          block
          responsiveControl={{
            mobile: {
              item: (row) => {
                const notifType = row.notification?.type || "LAINNYA";
                let Icon = faBell;
                if (notifType === "BOOKING") Icon = faFileLines;
                if (notifType === "FINANCE") Icon = faMoneyBillWave;

                return (
                  <Link href={"/dashboard" + row?.notification?.redirect}>
                    <div className="border bg-white rounded-lg px-4 py-3 flex items-start gap-3 transition-colors w-full">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
                        <FontAwesomeIcon icon={Icon} className="w-4 h-4" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-on-surface font-bold text-sm">{row.notification?.title || "Notifikasi"}</h4>
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{row.notification?.body || "-"}</p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          {row?.notification?.created_at ? moment(row?.notification?.created_at).format("DD MMM YYYY HH:mm") : "-"}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              },
            }
          }}
        />
      </div>
    </Suspense>
  );
}
