"use client"

import { cn } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUser,
  faPhone,
  faMobileAlt,
  faMoneyBillWave,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";


export function BookingDetailSectionComponent({ booking }: { booking: any }) {
  const totalBill   = Number(booking.total_bill || 0);
  const totalPaid   = Number(booking.total_paid || 0);
  const remaining   = Math.max(0, totalBill - totalPaid);
  const isPaid      = totalPaid >= totalBill && totalBill > 0;
  const progress    = totalBill > 0 ? Math.min(100, (totalPaid / totalBill) * 100) : 0;

  const statusMap: Record<string, { label: string; bg: string; text: string }> = {
    draft:     { label: "Draft",     bg: "bg-gray-100",   text: "text-gray-600" },
    accepted:  { label: "Diterima",  bg: "bg-blue-100",   text: "text-blue-700" },
    ongoing:   { label: "Berjalan",  bg: "bg-amber-100",  text: "text-amber-700" },
    completed: { label: "Selesai",   bg: "bg-green-100",  text: "text-green-700" },
    cancelled: { label: "Dibatalkan", bg: "bg-red-100",   text: "text-red-700" },
  };

  const status = statusMap[booking.status] || statusMap.draft;

  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
      {/* Header with booking number & status */}
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faHashtag} className="text-sm text-primary" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">No. Pesanan</p>
            <p className="font-bold text-on-surface">{booking.number || "-"}</p>
          </div>
        </div>
        <span className={cn("text-xs font-bold px-3 py-1 rounded-full", status.bg, status.text)}>
          {status.label}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Customer Info */}
        <div>
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Informasi Pemesan
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                <FontAwesomeIcon icon={faUser} className="text-xs" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Nama Pemesan</p>
                <p className="font-semibold text-on-surface text-sm">{booking.customer_name || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                <FontAwesomeIcon icon={faPhone} className="text-xs" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Kontak</p>
                <p className="font-semibold text-on-surface text-sm">{booking.customer_contact || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Info */}
        <div className="border-t pt-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Unit Disewa
          </h3>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
              <FontAwesomeIcon icon={faMobileAlt} className="text-xs" />
            </div>
            <div>
              <p className="font-semibold text-on-surface text-sm">
                {booking.unit?.label || booking.unit?.code || "-"}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {booking.unit?.unit_category?.name || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="border-t pt-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Jadwal Sewa
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Mulai</p>
                <p className="font-semibold text-on-surface text-sm">{booking.start_date || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Selesai</p>
                <p className="font-semibold text-on-surface text-sm">{booking.end_date || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Ringkasan Pembayaran
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Total Tagihan</span>
              <span className="text-sm font-bold text-on-surface">
                Rp {totalBill.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Total Dibayar</span>
              <span className="text-sm font-bold text-green-600">
                Rp {totalPaid.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm font-semibold text-on-surface">Sisa Tagihan</span>
              <span className={cn("text-sm font-bold", isPaid ? "text-green-600" : "text-danger")}>
                Rp {remaining.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-500 text-[10px]" />
              </div>
              <div className="flex-grow">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-500", isPaid ? "bg-green-500" : "bg-primary")}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className={cn("text-[10px] font-bold whitespace-nowrap", isPaid ? "text-green-600" : "text-primary")}>
                {isPaid ? "LUNAS" : "BELUM LUNAS"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
