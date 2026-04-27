"use client"

import Link from "next/link";
import { useGetApi, conversion } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMoneyBill, faUser } from "@fortawesome/free-solid-svg-icons";
import { BookingStatusComponent } from "../../booking/_constructs/booking-status.construct";

export function RecentBookingListComponent() {
  const { data: responseBody, loading } = useGetApi({
    path: "bookings",
    params: { paginate: 5 }
  });

  const bookings = responseBody?.data?.data || responseBody?.data || [];

  return (
    <>
      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="text-base font-bold">Pesanan Terbaru</h2>
        <Link href="/dashboard/booking" className="text-xs font-semibold text-primary">
          Lihat Semua
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {loading ? (
          <div className="text-center text-sm text-gray-500 py-4">Memuat data...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4">Belum ada pesanan</div>
        ) : (
          <div className="border bg-white rounded-lg w-full">
            {bookings.slice(0, 5).map((row: any, i: number) => (
              <Link href={`/dashboard/booking/${row.id}`} key={i}>
                <div className={`flex items-center gap-2 transition-colors w-full p-2 ${i === 0 ? "" : "border-t"}`}>
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2 mb-2 p-2 border-b">
                      <span className="text-xs font-semibold text-light-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                        #{row.number || "-"}
                      </span>
                      <BookingStatusComponent status={row.status || "DRAFT"} size="xs" />
                    </div>
                    <div className="space-y-1 pb-2">
                      <div className="flex items-center gap-2 px-2">
                        <div className="w-7 aspect-square flex items-center justify-center bg-gray-50 rounded-md">
                          <FontAwesomeIcon icon={faUser} className="text-xs text-foreground" />
                        </div>
                        <p className="text-sm font-semibold line-clamp-1">
                          {row.customer_name || "-"} ({row.customer_contact || "-"})
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <div className="w-7 aspect-square flex items-center justify-center bg-blue-50 rounded-md">
                          <FontAwesomeIcon icon={faCalendar} className="text-xs text-primary" />
                        </div>
                        <p className="text-sm font-semibold line-clamp-1">
                          {row.start_at ? conversion.date(row.start_at) : "-"} s/d {row.end_at ? conversion.date(row.end_at) : "-"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <div className="w-7 aspect-square flex items-center justify-center bg-yellow-50 rounded-md">
                          <FontAwesomeIcon icon={faMoneyBill} className="text-xs text-warning" />
                        </div>
                        <p className="text-sm font-semibold line-clamp-1">
                          Tagihan: {conversion.currency(row.total_bill || row.total || 0)} | Dibayar: {conversion.currency(row.total_paid || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
