"use client"

import Link from "next/link";
import { useGetApi, conversion } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { BookingStatusComponent } from "../../booking/_constructs/booking-status.construct";
import { useMemo } from "react";

interface TodayBookingListProps {
  type   :  "pickup" | "return";
  title  :  string;
  icon   :  typeof faArrowDown;
}

export function TodayBookingListComponent({ type, title, icon }: TodayBookingListProps) {
  const today = new Date().toISOString().slice(0, 10);
  
  const params = useMemo(() => ({
    expand: ["unit", "unit.unit_category"], 
    paginate: 10,
    filter: [
      ...(type === "pickup" 
        ? [{ column: "status", type: "in" as any, value: ["ORDERED"] }] 
        : [{ column: "status", type: "in" as any, value: ["RENTED"] }]
      )
    ]
  }), [type]);

  const includeParams = useMemo(() => ({
    ...(type === "pickup" 
      ? { start_at: today }
      : { end_at: today }
    )
  }), [type, today]);

  const { data: responseBody, loading } = useGetApi({
    path: "bookings",
    params,
    includeParams
  });

  const bookings = responseBody?.data?.data || responseBody?.data || [];

  return (
    <>
      <div className="flex items-center justify-between mb-4 mt-8">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={icon} className={`text-sm ${type === "pickup" ? "text-primary" : "text-warning"}`} />
          <h2 className="text-base font-bold">{title}</h2>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-2">
        {loading ? (
          <div className="text-center text-sm text-gray-500 py-4">Memuat data...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4 bg-white rounded-lg border">Tidak ada pesanan</div>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {bookings.slice(0, 5).map((row: any, i: number) => (
              <Link href={`/dashboard/booking/${row.id}`} key={i}>
                <div className="border bg-white rounded-lg flex items-center gap-2 transition-colors w-full">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2 mb-2 p-2 border-b">
                      <div>
                        <div className="text-xs font-semibold">#{row.number || "-"}</div>
                        <div className="text-[10px]">{row.start_at && row.end_at ? `${conversion.date(row.start_at)} s/d ${conversion.date(row.end_at)}` : ""}</div>
                      </div>
                      <BookingStatusComponent status={row.status || "DRAFT"} size="xs" />
                    </div>
                    <div className="pt-1 pb-3">
                      <div className="flex justify-between">
                        {row?.unit ? (
                          <div className="flex items-center gap-3 px-2">
                            <div className="w-8 aspect-square flex items-center justify-center rounded-full" style={{ backgroundColor: row?.unit?.unit_category?.color || "" }}>
                              <FontAwesomeIcon icon={faMobileAlt} className="text-sm text-white" />
                            </div>
                            <div>
                              <p className="text-[9px]">{row?.unit?.code}</p>
                              <p className="text-sm font-semibold -mt-0.5">{row?.unit?.unit_category?.name}</p>
                            </div>
                          </div>
                        ) : <div className="text-center w-full text-xs text-light-foreground">Belum ada informasi</div>}

                        {row.customer_name && (
                          <div className="text-right pr-2">
                            <p className="text-[9px]">{row.customer_contact || "-"}</p>
                            <p className="text-sm font-semibold -mt-0.5">{row.customer_name || "-"}</p>
                          </div>
                        )}
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
