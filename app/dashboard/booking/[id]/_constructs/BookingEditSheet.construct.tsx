"use client"

import { BottomSheetComponent, FormSupervisionComponent } from "@/components";
import { UnitListSelectorComponent } from "../../_constructs/UnitListSelector.construct";
import { conversion } from "@utils";

export function BookingEditSheet({ 
  booking, 
  show, 
  onClose,
  onSuccess,
  editType
}: { 
  booking: any; 
  show: boolean; 
  onClose: () => void;
  onSuccess?: () => void;
  editType: "customer" | "unit" | "schedule" | null;
}) {
  if (!booking || !editType) return null;

  // const titles = {
  //   customer: "Ubah Informasi Pemesan",
  //   unit: "Ubah Unit Disewa",
  //   schedule: "Ubah Jadwal Sewa"
  // };

  // const descriptions = {
  //   customer: "Perbarui nama dan kontak pemesan.",
  //   unit: "Pilih unit lain yang tersedia untuk disewa.",
  //   schedule: "Perbarui tanggal mulai dan selesai sewa."
  // };

  return (
    <BottomSheetComponent show={show} onClose={onClose} className="z-[60]">
      <div className="p-4 flex flex-col h-full overflow-y-auto">
        {/* <div className="mb-4">
          <h3 className="text-lg font-bold text-on-surface">{titles[editType]}</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            {descriptions[editType]}
          </p>
        </div> */}
        
        <FormSupervisionComponent
          className="flex-1"
          submitControl={{
            path: `bookings/${booking.id}`,
            method: "PUT"
          }}
          defaultValue={{
            customer_name: booking.customer_name || "",
            customer_contact: booking.customer_contact || "",
            start_date: booking.start_at ? conversion.date(booking.start_at, "YYYY-MM-DDTHH:mm") : "",
            end_date: booking.end_at ? conversion.date(booking.end_at, "YYYY-MM-DDTHH:mm") : "",
            unit_id: booking.unit_id || ""
          }}
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onClose();
          }}
          fields={[
            ...(editType === "customer" ? [
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
              }
            ] : []),
            ...(editType === "schedule" ? [
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
              }
            ] : []),
            ...(editType === "unit" ? [
              {
                col: 12,
                type: "custom" as const,
                construction: ({ formControl }: any) => {
                  const ctrl = formControl("unit_id");
                  return (
                    <div className="mb-4">
                      <UnitListSelectorComponent
                        value={ctrl.value}
                        invalid={ctrl.invalid}
                        onChange={(val) => ctrl.onChange(val)}
                        register={ctrl.register}
                      />
                      {ctrl.invalid && (
                        <p className="text-xs text-danger mt-1">Unit harus dipilih</p>
                      )}
                    </div>
                  );
                }
              }
            ] : [])
          ] as any}
        />
      </div>
    </BottomSheetComponent>
  );
}
