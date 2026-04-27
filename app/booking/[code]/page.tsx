"use client"

import { useEffect, useState, use } from "react";
import { api } from "@utils";
import { FormSupervisionComponent } from "@components";
import { BookingDetailComponent } from "./_structures/BookingDetail.component";
import { CustomerUnitListSelectorComponent } from "./_constructs/UnitListSelector.construct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

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

  // Memphis Header
  const MemphisHeader = () => (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{
        background: "#1a1a1a",
        borderBottom: "3px solid #1a1a1a",
      }}
    >
      <div
        className="w-8 h-8 flex items-center justify-center cursor-pointer"
        style={{
          border: "2px solid #ffffff",
        }}
        onClick={() => window.history.back()}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-white text-sm" />
      </div>
      <p
        style={{
          color: "#ffffff",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          fontSize: "13px",
        }}
      >
        SEWA IPHONE MADIUN
      </p>
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
    <div className="min-h-screen" style={{ background: "#f5f0e8" }}>
      <MemphisHeader />
      
      <div className="max-w-md mx-auto p-4">
        {/* Dotted border wrapper */}
        <div
          style={{
            border: "3px dotted #c4c4c4",
            padding: "16px",
            background: "#ffffff",
          }}
        >
          {isDraft ? (
            <div className="memphis-form">
              {/* Memphis-scoped CSS for form inputs */}
              <style>{`
                .memphis-form .input-label {
                  font-weight: 800 !important;
                  text-transform: uppercase !important;
                  letter-spacing: 0.1em !important;
                  font-size: 11px !important;
                  color: #1a1a1a !important;
                }
                .memphis-form .input {
                  border: 2.5px solid #1a1a1a !important;
                  border-radius: 0px !important;
                  padding: 12px 14px !important;
                  font-size: 14px !important;
                  background: #ffffff !important;
                }
                .memphis-form .input:focus {
                  border-color: #ff2d78 !important;
                }
              `}</style>

              {/* Form Title */}
              <div className="mb-5 text-center">
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
                  unit_id           :  booking.unit_id
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
                      {isLoading ? "MENYIMPAN..." : "SIMPAN"}
                    </button>
                  </div>
                )}
                fields={[
                  {
                    col: 12,
                    construction: {
                      name         :  "customer_name",
                      label        :  "Nama Pemesan",
                      placeholder  :  "Masukkan nama lengkap Anda",
                      validations  :  ["required", "max:200"],
                    }
                  },
                  {
                    col: 12,
                    construction: {
                      name         :  "customer_contact",
                      label        :  "Kontak Pemesan (WA)",
                      placeholder  :  "08xxxxxxxxxx",
                      validations  :  ["required", "max:200"],
                    }
                  },
                  {
                    col: 12,
                    construction: {
                      type         :  "datetime-local",
                      name         :  "start_at",
                      label        :  "Tanggal Mulai",
                      placeholder  :  "Pilih tanggal mulai",
                      validations  :  ["required"],
                    }
                  },
                  {
                    col: 12,
                    construction: {
                      type         :  "datetime-local",
                      name         :  "end_at",
                      label        :  "Tanggal Selesai",
                      placeholder  :  "Pilih tanggal selesai",
                      validations  :  ["required"],
                    }
                  },
                  {
                    col: 12,
                    type: "custom",
                    construction: ({ formControl }) => {
                      const ctrl = formControl("unit_id");
                      return (
                        <div className="pb-2">
                          <CustomerUnitListSelectorComponent
                            value={ctrl.value}
                            invalid={ctrl.invalid}
                            onChange={(val) => ctrl.onChange(val)}
                            register={ctrl.register}
                          />
                        </div>
                      );
                    }
                  },
                ]}
              />
            </div>
          ) : (
            <BookingDetailComponent booking={booking} />
          )}
        </div>
      </div>
    </div>
  );
}
