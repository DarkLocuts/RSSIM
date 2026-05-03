"use client"

import { useState } from "react";
import { conversion, api } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser, faPhone, faHashtag, faCamera, faTimes, faEdit, faLink, faCopy, faCheckCircle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { BookingStatusComponent } from "../../_constructs/booking-status.construct";
import UnitCategoryCardComponent from "@/app/dashboard/category/_constructs/UnitCategoryCard.component";
import { BottomSheetComponent, ButtonComponent, InputComponent, ModalConfirmComponent, ToastComponent } from "@/components";
import { BookingTakeSheet } from "../_constructs/BookingTakeSheet.construct";
import { BookingCancelSheet } from "../_constructs/BookingCancelSheet.construct";
import { BookingEditSheet } from "../_constructs/BookingEditSheet.construct";

export function BookingDetailSectionComponent({ booking, onRefresh }: { booking: any, onRefresh?: () => void }) {
  const [editType, setEditType]                      =  useState<"customer" | "unit" | "schedule" | null>(null);
  const [showCameraSheet, setShowCameraSheet]        =  useState(false);
  const [showCancelSheet, setShowCancelSheet]        =  useState(false);
  const [showLinkSheet, setShowLinkSheet]            =  useState(false);
  const [showLinkToast, setShowLinkToast]            =  useState(false);
  const [showDoneConfirm, setShowDoneConfirm]        =  useState(false);
  const [doneLoading, setDoneLoading]                =  useState(false);
  const [showCustomerDetail, setShowCustomerDetail]  =  useState(false);

  const handleMarkDone = async () => {
    setDoneLoading(true);
    const res = await api({
      path: `bookings/${booking.id}/update-status`,
      method: "POST",
      payload: { status: "DONE" }
    });
    if (res?.status === 201) {
      if (onRefresh) onRefresh();
    }
    setDoneLoading(false);
    setShowDoneConfirm(false);
  };

  return (
    <>
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="px-4 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faHashtag} className="text-sm text-primary" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant">No. Pesanan</p>
            <p className="font-bold text-sm text-on-surface">{booking.number || "-"}</p>
          </div>
        </div>
        <BookingStatusComponent status={booking.status || "DRAFT"} />
      </div>

      <div className="py-4 flex flex-col gap-4">
        <div className="px-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Informasi Pemesan
            </h3>

            <div className="flex gap-2">
              <ButtonComponent
                icon={faMagnifyingGlass}
                size="xs"
                rounded
                variant="outline"
                onClick={() => setShowCustomerDetail(true)}
                label="Detail"
              />
              {(booking.status !== "RETURNED" && booking.status !== "DONE" && booking.status !== "CANCELED") &&
                <ButtonComponent
                  icon={faEdit}
                  size="xs"
                  rounded
                  variant="outline"
                  onClick={() => setEditType("customer")}
                  label="Ubah Data"
                />
              }
            </div>
          </div>
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

        <div className="border-t pt-4 px-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Unit Disewa
            </h3>
            {(booking.status !== "RETURNED" && booking.status !== "DONE" && booking.status !== "CANCELED") &&
              <ButtonComponent
                icon={faEdit}
                size="xs"
                rounded
                variant="outline"
                onClick={() => setEditType("unit")}
                label="Ubah Unit"
              />
            }
          </div>
          <div className="flex items-start gap-3">
            <UnitCategoryCardComponent data={booking.unit?.unit_category || null} />
          </div>
        </div>

        <div className="border-t pt-4 px-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Jadwal Sewa
            </h3>
            {(booking.status !== "RETURNED" && booking.status !== "DONE" && booking.status !== "CANCELED") &&
              <ButtonComponent
                icon={faEdit}
                size="xs"
                rounded
                variant="outline"
                onClick={() => setEditType("schedule")}
                label="Ubah Jadwal"
              />
            }
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 text-cyan-600">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Mulai</p>
                <p className="font-semibold text-on-surface text-sm">{booking.start_at ? conversion.date(booking.start_at, "DD-MM-YYYY HH:mm") : "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Selesai</p>
                <p className="font-semibold text-on-surface text-sm">{booking.end_at ? conversion.date(booking.end_at, "DD-MM-YYYY HH:mm") : "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 flex flex-col gap-2 py-4 border-t">
        {booking.status === "ORDERED" && (
          <ButtonComponent
            size="sm"
            className="w-full py-4"
            label="Foto Pengambilan"
            icon={faCamera}
            onClick={() => setShowCameraSheet(true)}
            block
            rounded
          />
        )}

        {booking.status === "RENTED" && (
          <ButtonComponent
            size="sm"
            className="w-full py-4"
            label="Foto Pengembalian"
            icon={faCamera}
            onClick={() => setShowCameraSheet(true)}
            block
            rounded
          />
        )}

        {booking.status === "RETURNED" && (
          <ButtonComponent
            size="sm"
            className="w-full py-4"
            label="Pesanan Selesai"
            icon={faCheckCircle}
            onClick={() => setShowDoneConfirm(true)}
            block
            rounded
            paint="success"
          />
        )}

        <ButtonComponent
          size="sm"
          className="w-full py-4"
          label="Link Pemesanan"
          icon={faLink}
          onClick={() => setShowLinkSheet(true)}
          block
          rounded
          variant="outline"
          disabled={booking.status === "CANCELED"}
        />

        {booking.status !== "CANCELED" && booking.status !== "RENTED" && booking.status !== "RETURNED" && booking.status !== "DONE" && (
          <ButtonComponent
            size="sm"
            className="w-full py-4"
            label="Batalkan Pesanan"
            icon={faTimes}
            variant="outline"
            paint="danger"
            onClick={() => setShowCancelSheet(true)}
            block
            rounded
        />
        )}
      </div>

      <BookingTakeSheet bookingId={booking.id} show={showCameraSheet} onClose={() => setShowCameraSheet(false)} onSuccess={() => { if(onRefresh) onRefresh() }} type={booking.status === "ORDERED" ? "RENTED" : "RETURNED"} />
      <BookingCancelSheet bookingId={booking.id} show={showCancelSheet} onClose={() => setShowCancelSheet(false)} onSuccess={() => { if(onRefresh) onRefresh() }} />
      <BookingEditSheet 
        booking={booking} 
        show={!!editType} 
        editType={editType}
        onClose={() => setEditType(null)} 
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </div>

    <BottomSheetComponent
        show={showLinkSheet}
        onClose={() => setShowLinkSheet(false)}
        size={320}
      >
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-2 border-b pb-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
              <FontAwesomeIcon icon={faLink} className="text-xl" />
            </div>
            <h6 className="font-bold text-lg text-center text-foreground">Link Pemesanan</h6>
            <p className="text-sm text-center text-light-foreground leading-relaxed">
              Pesanan kosong berhasil dibuat. Silakan salin link di bawah ini dan bagikan kepada pelanggan.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-light-foreground uppercase">Tautan</span>
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                <InputComponent
                  value={`${window.location.origin}/booking/${booking.code}`}
                  readOnly
                  className="bg-gray-50 text-sm"
                />
              </div>
              <ButtonComponent
                icon={faCopy}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/booking/${booking.code}`);
                  setShowLinkToast(true);
                }}
              />
            </div>
          </div>
        </div>
      </BottomSheetComponent>

      {/* Customer Detail BottomSheet */}
      <CustomerDetailSheet booking={booking} show={showCustomerDetail} onClose={() => setShowCustomerDetail(false)} />

      <ModalConfirmComponent
        show={showDoneConfirm}
        onClose={() => setShowDoneConfirm(false)}
        title="Tandai pesanan ini sebagai selesai?"
        submitControl={{
          loading: doneLoading,
          onClick: handleMarkDone
        }}
      />

      <ToastComponent
        show={showLinkToast}
        onClose={() => setShowLinkToast(false)}
        title="Link berhasil disalin!"
        paint="success"
      />
    </>
  );
}


// ==============================>
// ## Customer Detail BottomSheet (Poin 4)
// ==============================>
function CustomerDetailSheet({ booking, show, onClose }: { booking: any; show: boolean; onClose: () => void }) {
  const storageHost = process.env.NEXT_PUBLIC_STORAGE_HOST || "";

  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const fields = [
    { label: "Nama Lengkap", value: booking.customer_name },
    { label: "Nomor HP", value: booking.customer_contact },
    { label: "Email", value: booking.customer_email },
    { label: "IG/FB", value: booking.customer_social_media },
    { label: "Alamat Lengkap", value: booking.customer_address },
    { label: "Nama Ibu", value: booking.customer_mother_name },
    { label: "Nama Ayah", value: booking.customer_father_name },
    { label: "No HP (Ayah/Ibu/Saudara)", value: booking.customer_phone },
  ];

  const images = [
    { label: "Foto KTP/SIM/KP", value: booking.customer_id_image },
    { label: "Foto KK", value: booking.customer_kk_image },
    { label: "Foto Bukti DP/Lunas", value: booking.customer_payment_proof_image },
  ];

  return (
    <BottomSheetComponent show={show} onClose={onClose} size="98vh" className="z-[60]">
      <div className="p-5 overflow-y-auto">
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Detail Pemesan</h4>
        <div className="flex flex-col gap-3">
          {fields.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <div>
                <p className="text-xs text-on-surface-variant">{f.label}</p>
                <p className="font-semibold text-on-surface text-sm">{f.value || "-"}</p>
              </div>
            </div>
          ))}
        </div>

        {images.some(img => img.value) && (
          <div className="mt-4 pt-4">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Dokumen</h4>
            <div className="grid grid-cols-1 gap-3">
              {images.map((img, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-on-surface-variant">{img.label}</p>
                    {img.value && (
                      <button 
                        onClick={() => handleDownload(`${storageHost}${img.value}`, `document-${booking.number || "foto"}-${i}.jpg`)}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Download
                      </button>
                    )}
                  </div>
                  {img.value ? (
                    <div className="rounded-xl overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${storageHost}${img.value}`} alt={img.label} className="w-full h-auto object-contain" />
                    </div>
                  ) : (
                    <div className="rounded-xl border bg-surface py-4 flex items-center justify-center text-xs text-light-foreground">Tidak ada foto</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BottomSheetComponent>
  );
}
