"use client"

import { useEffect, useState, use } from "react";
import { api, conversion } from "@utils";
import { FormSupervisionComponent } from "@components";
import { BookingDetailComponent } from "./_structures/BookingDetail.component";
import { CustomerUnitListSelectorComponent } from "./_constructs/UnitListSelector.construct";
import { InputBookingComponent } from "./_constructs/InputBooking.component";

const statusColor = {
  DRAFT     :  "bg-slate-100 text-slate-600",
  ORDERED   :  "bg-cyan-100 text-cyan-600",
  RENTED    :  "bg-blue-100 text-primary",
  RETURNED  :  "bg-green-100 text-success",
  CANCELED  :  "bg-red-100 text-danger",
}

const statusLabel = {
  DRAFT     :  "DIBUAT",
  ORDERED   :  "DIPESAN",
  RENTED    :  "DISEWA",
  RETURNED  :  "SELESAI",
  CANCELED  :  "DIBATALKAN",
}

export default function PublicBookingPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const { code } = resolvedParams;
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    setLoading(true);
    const res = await api({
      path: `customer-booking/${code}`,
      params: { expand: ["unit", "unit.unit_category"] }
    });
    
    if (res?.status === 200) {
      const found = res?.data?.data || null;
      if (found) {
        setBooking(found);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooking();
  }, [code]);

  const MemphisHeader = () => (
    <div className="relative">
      <div className="px-6 py-4 border-b-2 !border-black bg-white relative z-20">
        <p className="text-black font-extrabold uppercase tracking-widest">SEWA IPHONE MADIUN</p>
      </div>
      <div className="absolute w-full h-full bg-black top-1 left-1 z-10"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
        <MemphisHeader />
        <div className="p-6 flex-grow flex justify-center items-center min-h-[60vh]">
          <p
            className="animate-pulse"
            style={{
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#1a1a1a",
              fontSize: "14px",
            }}
          >
            Memuat pesanan...
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
        <MemphisHeader />
        <div className="p-6 flex-grow flex justify-center items-center min-h-[60vh]">
          <div
            className="p-6 text-center w-full max-w-sm"
            style={{
              background: "#ffffff",
              border: "3px solid #1a1a1a",
            }}
          >
            <h2
              className="mb-2"
              style={{
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#ff2d78",
                fontSize: "18px",
              }}
            >
              Tidak Ditemukan
            </h2>
            <p style={{ color: "#666", fontSize: "13px" }}>
              Pesanan dengan nomor #{code} tidak dapat ditemukan.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isDraft = !booking.status || booking.status === "DRAFT";

  return (
    <div 
      className="min-h-screen bg-white"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'2\' fill=\'%231a1a1a\' fill-opacity=\'0.15\'/%3E%3C/svg%3E")',
        backgroundSize: '24px 24px'
      }}
    >
      <MemphisHeader />
      
      <div className="max-w-md mx-auto max-h-[calc(100vh-60px)] overflow-y-auto p-6 pt-10 scroll-memphis">
        {!isDraft && (
          <>
            <div className="relative mb-8 -rotate-2">
              <div className="absolute w-full h-full bg-black top-2 left-2 z-10"></div>
              <div className="bg-[#7dd3fc] border-4 !border-black p-4 relative z-20 ">
                <h2 className="text-2xl font-extrabold text-black tracking-widest">
                  PESANAN
                  <br />
                  #{booking.number || "-"}
                </h2>
              </div>
            </div>
            <div className="relative mb-6">
              <div className="absolute w-full h-full bg-black top-2 left-2 z-10"></div>
              <div className="absolute -top-1 -left-2 bg-white border-2 px-1 py-0.5 !border-black -rotate-5 text-[#ff2d78] font-bold text-xs uppercase tracking-widest z-30">Status</div>
              <div className={`${statusColor[(booking?.status || "DRAFT") as keyof typeof statusColor]} border-4 !border-black p-4 relative z-20 font-extrabold uppercase tracking-widest`}>
                {statusLabel[(booking?.status || "DRAFT") as keyof typeof statusLabel]}
              </div>
            </div>
          </>
        )}
        <div className="relative">
          <div className="absolute w-full h-full bg-black top-2 left-2 z-10"></div>
          <div className="absolute w-7 h-7 -top-2 -left-2 bg-[#ff2d78] border-4 !border-black rounded-full z-30"></div>
          <div className="bg-[#f5f0e8] border-4 !border-black p-4 relative z-20 ">
            {isDraft ? (
              <div className="memphis-form">
                <div className="mb-8 pb-6 pt-2 text-center border-b-4 !border-black">
                  <h2
                    style={{
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#1a1a1a",
                      fontSize: "22px",
                      lineHeight: "1.2",
                    }}
                  >
                    FORMULIR
                    <br />
                    PEMESANAN
                  </h2>
                </div>

                <FormSupervisionComponent
                  submitControl={{
                    path: `customer-booking/${booking.code}`,
                    method: "POST"
                  }}
                  defaultValue={{
                    customer_name     :  booking.customer_name,
                    customer_contact  :  booking.customer_contact,
                    start_date        :  booking.start_date,
                    end_date          :  booking.end_date,
                    unit_category_id  :  booking.unit_category_id
                  }}
                  onSuccess={() => {
                    fetchBooking();
                  }}
                  footerControl={({ loading: isLoading }) => (
                    <div className="mt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          background: "#ff2d78",
                          color: "#ffffff",
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "0.15em",
                          fontSize: "14px",
                          border: "3px solid #1a1a1a",
                          borderRadius: "0px",
                          padding: "14px 24px",
                          width: "100%",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          opacity: isLoading ? 0.7 : 1,
                        }}
                      >
                        {isLoading ? "MENGIRIMKAN..." : "PESAN SEKARANG"}
                      </button>
                    </div>
                  )}
                  fields={[
                    {
                      col: 12,
                      type: "custom",
                      construction: ({ formControl }) => <InputBookingComponent 
                        name="customer_namer" 
                        label="Nama" 
                        placeholder="Masukkan nama lengkap..."
                        {...formControl("customer_name")} 
                      />
                    },
                    {
                      col: 12,
                      type: "custom",
                      construction: ({ formControl }) => <InputBookingComponent 
                        name="customer_contact" 
                        label="Kontak Pemesan (WA)" 
                        placeholder="08xxxxxxxxxx"
                        {...formControl("customer_contact")} 
                      />
                    },
                    {
                      col: 12,
                      type: "custom",
                      construction: ({ formControl }) => <InputBookingComponent 
                        type="datetime-local"
                        name="start_at" 
                        label="Tanggal Pengambilan" 
                        placeholder="Pilih tanggal mulai"
                        {...formControl("start_at")} 
                      />
                    },
                    {
                      col: 12,
                      type: "custom",
                      construction: ({ formControl }) => <InputBookingComponent 
                        type="datetime-local"
                        name="end_at" 
                        label="Tanggal Pengembalian" 
                        placeholder="Pilih tanggal selesai"
                        {...formControl("end_at")} 
                      />
                    },
                    {
                      col: 12,
                      type: "custom",
                      construction: ({ formControl, setValues, values }) => {
                        const startAt = values?.find((v: any) => v.name === "start_at")?.value;
                        const endAt   = values?.find((v: any) => v.name === "end_at")?.value;

                        if (!startAt || !endAt) {
                          return (
                            <div className="pb-2">
                              <label className="font-bold uppercase tracking-wider text-black">
                                PILIH IPHONE
                              </label>
                              <div
                                className="mt-2 p-4 border-2 !border-black bg-[#fffbf0] text-center"
                                style={{ fontSize: "12px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}
                              >
                                Isi tanggal pengambilan &amp; pengembalian terlebih dahulu.
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="pb-2">
                            <CustomerUnitListSelectorComponent
                              value={formControl("unit_category_id").value}
                              invalid={formControl("unit_category_id").invalid}
                              onChange={(val, price) => {
                                setValues([ ...values.filter((v: any) => v.name != "unit_category_id" && v.name != "price"), { name: "unit_category_id", value: val }, { name: "price", value: price } ])
                              }}
                              register={formControl("unit_category_id").register}
                              availableAt={`${startAt}|${endAt}`}
                            />
                          </div>
                        );
                      }
                    },
                    {
                      col: 12,
                      type: "custom",
                      construction: ({ values }) => {
                        const start = values.find((v) => v.name == "start_at")?.value ? new Date(values.find((v: any) => v.name == "start_at")?.value) : null;
                        const end   = values.find((v) => v.name == "end_at")?.value ? new Date(values.find((v: any) => v.name == "end_at")?.value) : null;
                        let days = 0;
                        if (start && end && start <= end) {
                          const diffTime = Math.abs(end.getTime() - start.getTime());
                          days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        }
                        const price = values.find((v: any) => v?.name == "price")?.value || 0;
                        const total = days * price;

                        return (
                          <div className="p-4 bg-white border-2 border-b-4 border-r-4 !border-black mt-2">
                            <div className="flex justify-between items-center mb-2 pb-2 border-b-2 border-dashed !border-black">
                              <span className="font-bold uppercase tracking-wider text-black text-sm">Total Hari</span>
                              <span className="font-extrabold text-black">{days ? days + "Hari" : "-"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold uppercase tracking-wider text-black text-sm">Total Bayar</span>
                              <span className="font-extrabold text-[#ff2d78] text-xl">
                                {total ? conversion.currency(total) : "-"}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    }
                  ]}
                />
              </div>
            ) : (
              <BookingDetailComponent booking={booking} />
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center pb-2 mt-12">
            <p className="text-[11px] font-semibold text-black text-on-surface-variant uppercase tracking-wider">
              SEWA IPHONE MADIUN
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              RSSIM v1.0.0 - Creative By <span className="text-[#ff2d78]">SEJE Digital</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
