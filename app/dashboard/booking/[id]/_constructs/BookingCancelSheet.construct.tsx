"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@utils";
import { ButtonComponent, BottomSheetComponent, InputComponent } from "@/components";

export function BookingCancelSheet({ bookingId, show, onClose, onSuccess }: { bookingId: string, show: boolean, onClose: () => void, onSuccess?: () => void }) {
  const router = useRouter();
  
  const [cancelNote, setCancelNote] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const submitCancel = async () => {
    if (!cancelNote) return;
    setSubmittingCancel(true);
    
    const res = await api({
      path: `bookings/${bookingId}/update-status`,
      method: "POST",
      payload: {
        status: "CANCELED",
        note: cancelNote
      }
    });
    
    if (res?.status === 200 || res?.status === 201) {
      setTimeout(() => { onClose() }, 500);
      setCancelNote("");
      if (onSuccess) onSuccess();
      router.refresh();
    }
    setSubmittingCancel(false);
  };

  return (
    <BottomSheetComponent show={show} onClose={onClose} size="50vh" className="z-[60]">
      <div className="p-4 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-danger">Batalkan Pesanan</h3>
        <p className="text-sm text-on-surface-variant">
          Apakah Anda yakin ingin membatalkan pesanan ini? Silakan berikan alasan pembatalan.
        </p>
        <InputComponent
          label="Alasan Pembatalan"
          placeholder="Masukkan alasan..."
          value={cancelNote}
          onChange={(val) => setCancelNote(val)}
        />
        <div className="flex gap-3 mt-4">
          <ButtonComponent
            label="Tutup"
            onClick={onClose}
            variant="outline"
            rounded
            block
            className="py-3 flex-1"
            disabled={submittingCancel}
          />
          <ButtonComponent
            label="Batalkan Pesanan"
            paint="danger"
            onClick={submitCancel}
            loading={submittingCancel}
            rounded
            block
            className="py-3 flex-1"
            disabled={!cancelNote || submittingCancel}
          />
        </div>
      </div>
    </BottomSheetComponent>
  );
}
