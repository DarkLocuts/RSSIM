"use client"

import { Suspense, useState } from "react";
import { HeadbarComponent, IconButtonComponent, TableSupervisionComponent, ModalConfirmComponent, BottomSheetComponent, ButtonComponent, InputComponent, ToastComponent, InputCheckboxComponent } from "@components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UnitListSelectorComponent } from "./_constructs/UnitListSelector.construct";
import { faCopy, faLink, faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import { BookingStatusComponent } from "./_constructs/booking-status.construct";
import { conversion, api, useResponsive } from "@/utils";
import Link from "next/link";
import { useAuthContext } from "@/contexts";
import { useRouter } from "next/navigation";



export default function BookingPage() {
  const router = useRouter()
  const [showModal, setShowModal]      =  useState(false);
  const [showSheet, setShowSheet]      =  useState(false);
  const [createdLink, setCreatedLink]  =  useState("");
  const [loadingLink, setLoadingLink]  =  useState(false);
  const [showToast, setShowToast]      =  useState(false);



  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [filterCategory, setFilterCategory] = useState<any[]>([]);
  const [filterOutlet, setFilterOutlet] = useState<any[]>([]);



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
            params: {
              expand: ["unit", "unit.unit_category"],
              filter: [
                ...(filterOutlet?.length > 0 ? [{ column: "outlet_id", type: "in", value: filterOutlet }] : [])
              ] as any[]
            },
            includeParams: {
              ...(dateStart && dateEnd ? { booking_at: `${dateStart}|${dateEnd}` } : {}),
              ...(filterCategory?.length > 0 ? { unit_category_id: filterCategory.join(",") } : [])
            }
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
              selector: "start_at",
              label: "Tanggal Mulai",
              sortable: true,
              item: (r) => r.start_at ? conversion.date(r.start_at) : "-",
            },
            {
              selector: "end_at",
              label: "Tanggal Selesai",
              sortable: true,
              item: (r) => r.end_at ? conversion.date(r.end_at) : "-",
            },
            {
              selector: "total",
              label: "Total Tagihan",
              item: (r) => r.total ? conversion.currency(r.total) : "-",
              sortable: true
            },
            {
              selector: "total_paid",
              label: "Total Bayar",
              item: (r) => r.total_paid ? conversion.currency(r.total_paid) : "-",
              sortable: true
            },
            {
              selector: "status",
              label: "Status",
              item: (r) => <BookingStatusComponent status={r.status} />
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
                col: 12,
                construction: {
                  type         :  "datetime-local",
                  name         :  "start_at",
                  label        :  "Tanggal Mulai",
                  placeholder  :  "Pilih tanggal mulai",
                  validations  :  ["required"]
                }
              },
              {
                col: 12,
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
                construction: ({ formControl, values }) => {
                  const ctrl = formControl("unit_id");
                  const startAt = values?.find((v: any) => v.name === "start_at")?.value;
                  const endAt = values?.find((v: any) => v.name === "end_at")?.value;

                  if (!startAt || !endAt) {
                    return (
                      <div className="w-full flex flex-col gap-2">
                        <label className="input-label">
                          Unit<span className="text-danger">*</span>
                        </label>
                        <div className="text-sm text-warning p-6 border rounded-lg text-center font-medium">
                          Isi tanggal mulai dan tanggal selesai untuk memilih unit yang tersedia.
                        </div>
                      </div>
                    );
                  }

                  return (
                    <UnitListSelectorComponent
                      value={ctrl.value}
                      invalid={ctrl.invalid}
                      onChange={(val) => ctrl.onChange(val)}
                      register={ctrl.register}
                      availableAt={`${startAt}|${endAt}`}
                    />
                  );
                }
              },
            ]
          }}
          controlBar={[
            "CREATE",
            "SEARCH",
            <ButtonComponent key="link" icon={faLink} label="Buat Link" size="sm" className="hidden md:flex" variant="outline" />,
            <FilterUnit key="filter-unit" dateStart={dateStart} dateEnd={dateEnd} setDateStart={setDateStart} setDateEnd={setDateEnd} setFilterCategory={setFilterCategory} setFilterOutlet={setFilterOutlet} />]}
          detailControl={false}
          onRowClick={(row) => {
            router.push(`/dashboard/booking/${row.id}`);
          }}
          block
          actionControl={false}
          responsiveControl={{
            mobile: {
              item: (row) => {
                return (
                  <Link href={`/dashboard/booking/${row.id}`}>
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
                        <div className="px-2 py-2 border-t">
                          <p className="text-xs font-semibold">{row.total ? conversion.currency(row.total || 0) : "-"}</p>
                          <p className="text-[10px]">Terbayar: <span className="font-semibold">{row.total ? conversion.currency(row.total_paid || 0) : "-"}</span></p>
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
        className="md:hidden fixed bottom-40 right-5 w-12 h-12 z-50 bg-secondary transform active:scale-95 transition-transform"
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
              Link pesanan berhasil dibuat. Silakan salin link di bawah ini dan bagikan kepada pelanggan.
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



const FilterUnit = ({ dateStart, dateEnd, setDateStart, setDateEnd, setFilterCategory, setFilterOutlet }: any) => {
  const { isSm } = useResponsive();
  const { user } = useAuthContext();

  if(isSm) {
    return (
      <>
        <div className="px-2 pb-20 w-full">
          <p className="text-sm mb-2">Ketersediaan Unit</p>
          <div className="flex flex-col gap-2 p-2 border rounded-lg">
            <InputComponent
              type="date"
              label={"Dari"}
              name="_start_date"
              value={dateStart}
              onChange={(v) => setDateStart(v)}
              placeholder="YYYY-MM-DD"
              className="md:py-1.5 md:text-sm"
            />
            <InputComponent
              type="date"
              label={"Sampai"}
              name="_end_date"
              value={dateEnd}
              onChange={(v) => setDateEnd(v)}
              placeholder="YYYY-MM-DD"
              className="md:py-1.5 md:text-sm"
            />
          </div>

          <InputCheckboxComponent
            label="Jenis Unit"
            name="_filter_category"
            serverOptionControl={{ path: "unit-categories", params: {selectableOption: ["id", "name"]} }}
            vertical
            onChange={(v) => setFilterCategory(v)}
            className="max-h-[300px] label::mt-4"
          />

          {user?.role_id == 1 && (
            <InputCheckboxComponent
              label="Outlet"
              name="_filter_outlet"
              serverOptionControl={{ path: "outlets", params: {selectableOption: ["id", "name"]} }}
              vertical
              onChange={(v) => setFilterOutlet(v)}
              className="max-h-[300px] label::mt-4"
            />
          )}
        </div>
      </>
    ) 
  } else {
    return <></>;
  }
}