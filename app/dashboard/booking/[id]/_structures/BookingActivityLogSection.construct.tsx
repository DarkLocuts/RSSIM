"use client"

import { useState } from "react";
import { conversion } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faImage, faDownload } from "@fortawesome/free-solid-svg-icons";
import { BottomSheetComponent, ButtonComponent } from "@/components";

export function BookingActivityLogSectionComponent({ logs = [] }: { logs: any[] }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border mt-2">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface">Riwayat Aktifitas</h3>
      </div>
      <div className="p-4 flex flex-col gap-4 relative overflow-y-auto max-h-[300px]">
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

            <div className="flex justify-between gap-2 w-full">
              <div className="max-w-[65%]">
                <p className={`font-semibold text-sm capitalize ${index === 0 ? 'text-primary' : 'text-on-surface'}`}>
                  {log.type?.replace(/_/g, ' ') || 'Log'}
                </p>
                <p className="text-xs mt-1">
                  {log.note || "-"}
                </p>
                {log.image && (
                  <button 
                    onClick={() => setPreviewImage(log.image)}
                    className="mt-2 text-[11px] text-primary flex items-center gap-1.5 hover:underline font-medium bg-primary/10 px-2.5 py-1 rounded-md"
                  >
                    <FontAwesomeIcon icon={faImage} /> Lihat Foto
                  </button>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px]">
                  {log.created_at ? conversion.date(log.created_at, "DD/MM/YYYY HH:mm") : "-"}
                </p>
                <p className="text-[10px] font-bold">
                  {log.user?.name || '-'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomSheetComponent show={!!previewImage} onClose={() => setPreviewImage(null)} size="85vh" className="z-[70]">
        <div className="p-4 flex flex-col gap-4 h-full">
          <h3 className="text-lg font-bold">Foto Aktivitas</h3>
          {previewImage && (
            <>
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-black/5 flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={process.env.NEXT_PUBLIC_STORAGE_HOST + previewImage} alt="Log Activity" className="w-full h-full object-contain" />
              </div>
              <ButtonComponent
                icon={faDownload}
                label="Download Foto"
                onClick={async () => {
                  try {
                    const imageUrl = process.env.NEXT_PUBLIC_STORAGE_HOST + previewImage;
                    const response = await fetch(imageUrl);
                    if (!response.ok) throw new Error("Network response was not ok");
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = previewImage.split('/').pop() || "foto-aktivitas.jpg";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch {
                    window.open(process.env.NEXT_PUBLIC_STORAGE_HOST + previewImage, "_blank");
                  }
                }}
                block
                rounded
              />
            </>
          )}
        </div>
      </BottomSheetComponent>
    </div>
  );
}
