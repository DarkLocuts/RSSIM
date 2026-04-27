"use client"

import { conversion } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

export function BookingActivityLogSectionComponent({ logs = [] }: { logs: any[] }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden mt-2">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface">Riwayat Aktifitas</h3>
      </div>
      <div className="p-4 flex flex-col gap-4 relative">
        {!logs || logs.length < 1 ? <>
          <div className="flex flex-col items-center justify-center py-8 px-8 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={faReceipt} className="text-xl text-gray-400" />
            </div>
            <p className="text-sm text-on-surface-variant font-medium">Belum ada aktivitas</p>
          </div>
        </> : logs.map((log, index) => (
          <div key={index} className="flex gap-4 relative">
            {index !== logs.length - 1 && (
              <div className="absolute left-[5px] top-[12px] bottom-[-12px] w-[2px] bg-gray-200"></div>
            )}

            <div className="relative z-10 flex-shrink-0 mt-[6px]">
              <div className={`w-3 h-3 rounded-full ring-4 ring-white ${index === 0 ? 'bg-primary' : 'bg-gray-300'}`}></div>
            </div>

            <div className="flex flex-col flex-grow pb-6">
              <div className="flex justify-between items-start mb-1">
                <span className={`font-semibold text-sm capitalize ${index === 0 ? 'text-primary' : 'text-on-surface'}`}>
                  {log.type?.replace(/_/g, ' ') || 'Log'}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {log.created_at ? conversion.date(log.created_at, "DD-MM-YYYY HH:mm") : "-"}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Oleh: {log.user?.name || '-'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
