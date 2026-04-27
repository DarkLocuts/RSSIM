"use client"

import { Suspense, useState } from "react";
import { HeadbarComponent, IconButtonComponent, TableSupervisionComponent, ModalConfirmComponent, BottomSheetComponent, ButtonComponent, InputComponent, ToastComponent } from "@components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UnitListSelectorComponent } from "./_constructs/UnitListSelector.construct";
import { faCalendar, faCopy, faLink, faMoneyBill, faUser } from "@fortawesome/free-solid-svg-icons";
import { BookingStatusComponent } from "./_constructs/booking-status.construct";
import { conversion, api } from "@/utils";
import Link from "next/link";

export default function BookingPage() {
  const [showModal, setShowModal] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [createdLink, setCreatedLink] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCreateLink = async () => {
    setLoadingLink(true);

    const res = await api({
      path: "bookings",
      method: "POST",
      payload: {
        type: "LINK"
      }
    });

    if (res?.status === 200 || res?.status === 201) {
      const code: string = res?.data?.code || res?.data?.data?.code;
      
      if (code) {
        const link = `${window.location.origin}/booking/${code}`;
        setCreatedLink(link);
        setShowModal(false);
        setTimeout(() => {
          setShowSheet(true);
        }, 200);
      }
    }
    
    setLoadingLink(false);
  };

  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Pesanan" noBtnBack />

        <TableSupervisionComponent
          fetchControl={{
            path: "bookings",
          }}
          columnControl={[
            {
              selector: "number",
              label: "Nomor",
              sortable: true
            },
            {
              selector: "customer_name",
              label: "Nama Pemesan",
              sortable: true
            },
            {
              selector: "start_date",
              label: "Tanggal Mulai",
              sortable: true
            },
            {
              selector: "end_date",
              label: "Tanggal Selesai",
              sortable: true
            },
            {
              selector: "total_bill",
              label: "Total Tagihan",
              item: (r) => r.total_bill ? `Rp ${Number(r.total_bill).toLocaleString("id-ID")}` : "-",
              sortable: true
            },
            {
              selector: "total_paid",
              label: "Total Bayar",
              item: (r) => r.total_paid ? `Rp ${Number(r.total_paid).toLocaleString("id-ID")}` : "-",
              sortable: true
            },
          ]}
          formControl={{
            fields: [
              {
                construction: {
                  name         :  "customer_name",
                  label        :  "Nama Pemesan",
                  placeholder  :  "Masukkan nama pemesan",
                  validations  :  ["required", "max:200"]
                }
              },
              {
                construction: {
                  name         :  "customer_contact",
                  label        :  "Kontak Pemesan",
                  placeholder  :  "Masukkan nomor HP / email",
                  validations  :  ["required", "max:200"]
                }
              },
              {
                col: 6,
                construction: {
                  type         :  "datetime-local",
                  name         :  "start_at",
                  label        :  "Tanggal Mulai",
                  placeholder  :  "Pilih tanggal mulai",
                  validations  :  ["required"]
                }
              },
              {
                col: 6,
                construction: {
                  type         :  "datetime-local",
                  name         :  "end_at",
                  label        :  "Tanggal Selesai",
                  placeholder  :  "Pilih tanggal selesai",
                  validations  :  ["required"]
                }
              },
              {
                type: "custom",
                construction: ({ formControl }) => {
                  const ctrl = formControl("unit_id");
                  return (
                    <UnitListSelectorComponent
                      value={ctrl.value}
                      invalid={ctrl.invalid}
                      onChange={(val) => ctrl.onChange(val)}
                      register={ctrl.register}
                    />
                  );
                }
              },
              
            ]
          }}
          controlBar={["CREATE", "SEARCH"]}
          detailControl={false}
          block
          responsiveControl={{
            mobile: {
              item: (row) => {
                return (
                  <Link href={`/dashboard/booking/${row.id}`}>
                    <div className="border bg-white rounded-lg flex items-center gap-2 transition-colors w-full">
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
                            <p className="text-sm text-semibold line-clamp-1">{row.customer_name || "-"} ({row.customer_contact || "-"})</p>
                          </div>
                          <div className="flex items-center gap-2 px-2">
                            <div className="w-7 aspect-square flex items-center justify-center bg-blue-50 rounded-md">
                              <FontAwesomeIcon icon={faCalendar} className="text-xs text-primary" />
                            </div>
                            <p className="text-sm text-semibold line-clamp-1">{row.start_at ? conversion.date(row.start_at) : "-"} s/d {row.end_at ? conversion.date(row.end_at) : "-"}</p>
                          </div>
                          <div className="flex items-center gap-2 px-2">
                            <div className="w-7 aspect-square flex items-center justify-center bg-yellow-50 rounded-md">
                              <FontAwesomeIcon icon={faMoneyBill} className="text-xs text-warning" />
                            </div>
                            <p className="text-sm text-semibold line-clamp-1">Tagihan: {conversion.currency(row.total || 0)} | Dibayar: {conversion.currency(row.total_paid || 0)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              },
            }
          }}
        />
      </div>

      <IconButtonComponent
        icon={faLink}
        className="fixed bottom-40 right-5 w-12 h-12 z-50 bg-secondary transform active:scale-95 transition-transform"
        size="md"
        rounded
        onClick={() => setShowModal(true)}
      />

      <ModalConfirmComponent
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Buat Link Pemesanan"
        submitControl={{
          loading: loadingLink,
          onClick: handleCreateLink
        }}
      />

      <BottomSheetComponent
        show={showSheet}
        onClose={() => setShowSheet(false)}
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
                  value={createdLink}
                  readOnly
                  className="bg-gray-50 text-sm"
                />
              </div>
              <ButtonComponent
                icon={faCopy}
                onClick={() => {
                  navigator.clipboard.writeText(createdLink);
                  setShowToast(true);
                }}
              />
            </div>
          </div>
        </div>
      </BottomSheetComponent>

      <ToastComponent
        show={showToast}
        onClose={() => setShowToast(false)}
        title="Disalin"
        paint="success"
      />
    </Suspense>
  );
}
