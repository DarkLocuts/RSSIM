"use client"

import { DashboardCardComponent } from '@/components'
import { faClipboard, faClipboardCheck, faClipboardList, faMobileAlt, faMobilePhone } from "@fortawesome/free-solid-svg-icons";
import { useGetApi } from "@utils";

export function DashboardComponent() {
  const { data: responseBody, loading } = useGetApi({
    path: "dashboard",
  });

  const summary = responseBody?.data || {};

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold">Ringkasan Hari Ini</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <DashboardCardComponent 
          title="Semua Unit"
          value={loading ? "..." : String(summary.total_units || 0)}
          icon={faMobilePhone}
          iconBgColor='bg-blue-50'
          iconColor='text-blue-500'
        />

        <DashboardCardComponent 
          title="Unit Tersedia"
          value={loading ? "..." : String(summary.available_units || 0)}
          icon={faMobileAlt}
          iconBgColor='bg-green-50'
          iconColor='text-green-500'
        />
      </div>

      <DashboardCardComponent
        title="Pesanan Aktif"
        value={loading ? "..." : `${summary.active_bookings || 0} Pesanan`}
        icon={faClipboardList}
      />

      <div className="grid grid-cols-2 gap-2 mb-4 mt-2">
        <DashboardCardComponent 
          title="Dipesan"
          value={loading ? "..." : String(summary.status_booked || 0)}
          icon={faClipboard}
          iconBgColor='bg-amber-50'
          iconColor='text-warning'
        />
        <DashboardCardComponent 
          title="Berjalan"
          value={loading ? "..." : String(summary.status_ongoing || 0)}
          icon={faClipboardCheck}
          iconBgColor='bg-green-50'
          iconColor='text-green-500'
        />
      </div>
    </>
  )
}
