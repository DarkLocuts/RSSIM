"use client"

import { Suspense, useState } from "react";
import { 
  HeadbarComponent, 
  IconButtonComponent, 
  TableSupervisionComponent, 
  ModalConfirmComponent, 
  BottomSheetComponent, 
  ButtonComponent, 
  InputComponent,
  ToastComponent
} from "@components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faLink, faCopy } from "@fortawesome/free-solid-svg-icons";
import { UnitListSelectorComponent } from "./_constructs/UnitListSelector.construct";

export default function BookingPage() {
  const [showModal, setShowModal] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [createdLink, setCreatedLink] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCreateLink = async () => {
    setLoadingLink(true);
    // Dummy delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate dummy booking number
    const number = "BKG-" + Math.floor(10000 + Math.random() * 90000);
    const link = `${window.location.origin}/booking/${number}`;
    
    setCreatedLink(link);
    setLoadingLink(false);
    setShowModal(false);
    
    // Slight delay to ensure modal close animation runs smoothly
    setTimeout(() => {
      setShowSheet(true);
    }, 200);
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
                  name         :  "start_date",
                  label        :  "Tanggal Mulai",
                  placeholder  :  "Pilih tanggal mulai",
                  validations  :  ["required"]
                }
              },
              {
                col: 6,
                construction: {
                  type         :  "datetime-local",
                  name         :  "end_date",
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
                const isPaid = Number(row.total_paid || 0) >= Number(row.total_bill || 0);
                return (
                  <div className="border bg-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors w-full">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faCalendarCheck} className="text-sm text-[#0050d4]" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-on-surface font-bold text-base truncate">{row.customer_name || "Unknown"}</h4>
                        <span className="text-[10px] font-semibold text-[#68788f] bg-gray-100 px-1.5 py-0.5 rounded">
                          #{row.number || "-"}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {row.start_date || "-"} → {row.end_date || "-"}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-[#0050d4]">
                        Rp {Number(row.total_bill || 0).toLocaleString("id-ID")}
                      </p>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: isPaid ? "#69f6b8" : "rgb(248 160 16 / 0.2)",
                          color: isPaid ? "#005a3c" : "#4a2c00"
                        }}
                      >
                        {isPaid ? "Lunas" : "Belum Lunas"}
                      </span>
                    </div>
                  </div>
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
      >
        <p className="text-center text-sm text-light-foreground">
          Apakah Anda yakin ingin membuat pesanan kosong dan menghasilkan link pemesanan?
        </p>
      </ModalConfirmComponent>

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
