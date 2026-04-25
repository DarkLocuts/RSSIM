"use client"

import { useEffect, useState, use } from "react";
import { api } from "@utils";
import { HeadbarComponent, FormSupervisionComponent } from "@components";
import { UnitListSelectorComponent } from "../../dashboard/booking/_constructs/UnitListSelector.construct";
import { BookingDetailComponent } from "./_structures/BookingDetail.component";

export default function PublicBookingPage({ params }: { params: Promise<{ nomor: string }> }) {
  const resolvedParams = use(params);
  const { nomor } = resolvedParams;
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    setLoading(true);
    const res = await api({
      path: "bookings",
      params: { search: nomor, expand: ["unit", "unit.unit_category"] }
    });
    
    if (res?.status === 200) {
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      const found = data.find((b: any) => b.number === nomor);
      if (found) {
        setBooking(found);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooking();
  }, [nomor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <HeadbarComponent title={`Pesanan #${nomor}`} noBtnBack />
        <div className="p-4 flex-grow flex justify-center items-center">
          <p className="text-on-surface-variant animate-pulse font-medium">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <HeadbarComponent title={`Pesanan`} noBtnBack />
        <div className="p-4 flex-grow flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl border text-center shadow-sm max-w-sm w-full">
            <h2 className="text-lg font-bold text-danger mb-2">Tidak Ditemukan</h2>
            <p className="text-on-surface-variant text-sm">Pesanan dengan nomor #{nomor} tidak dapat ditemukan.</p>
          </div>
        </div>
      </div>
    );
  }

  const isDraft = !booking.status || booking.status === "draft";

  return (
    <div className="min-h-screen bg-background">
      <HeadbarComponent title={`Pesanan #${nomor}`} noBtnBack />
      
      <div className="max-w-md mx-auto p-4 pt-6 pb-20">
        {isDraft ? (
          <div className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-on-surface">Lengkapi Pesanan Anda</h2>
              <p className="text-sm text-on-surface-variant mt-1">Silakan isi formulir di bawah ini untuk melanjutkan pesanan Anda.</p>
            </div>
            <FormSupervisionComponent
              submitControl={{
                path: `bookings/${booking.id}`,
                method: "PUT"
              }}
              defaultValue={{
                customer_name: booking.customer_name,
                customer_contact: booking.customer_contact,
                start_date: booking.start_date,
                end_date: booking.end_date,
                unit_id: booking.unit_id
              }}
              onSuccess={() => {
                fetchBooking();
              }}
              fields={[
                {
                  col: 12,
                  construction: {
                    name         :  "customer_name",
                    label        :  "Nama Pemesan",
                    placeholder  :  "Masukkan nama pemesan",
                    validations  :  ["required", "max:200"]
                  }
                },
                {
                  col: 12,
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
                    name         :  "start_date",
                    label        :  "Tanggal Mulai",
                    placeholder  :  "Pilih tanggal mulai",
                    validations  :  ["required"]
                  }
                },
                {
                  col: 12,
                  construction: {
                    type         :  "datetime-local",
                    name         :  "end_date",
                    label        :  "Tanggal Selesai",
                    placeholder  :  "Pilih tanggal selesai",
                    validations  :  ["required"]
                  }
                },
                {
                  col: 12,
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
              ]}
            />
          </div>
        ) : (
          <BookingDetailComponent booking={booking} />
        )}
      </div>
    </div>
  );
}
