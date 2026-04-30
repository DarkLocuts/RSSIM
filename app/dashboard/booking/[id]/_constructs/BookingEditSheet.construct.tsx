"use client"

import { BottomSheetComponent, FormSupervisionComponent } from "@/components";
import { UnitListSelectorComponent } from "../../_constructs/UnitListSelector.construct";
import { cn, conversion } from "@utils";
import { faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BookingEditSheet({ 
  booking, 
  show, 
  onClose,
  onSuccess,
  editType
}: { 
  booking     :  any;
  show        :  boolean;
  onClose     :  () => void;
  onSuccess  ?:  () => void;
  editType    :  "customer" | "unit" | "schedule" | null;
}) {
  if (!booking || !editType) return null;

  return (
    <BottomSheetComponent show={show} onClose={onClose} size={editType === "unit" ? 670 : 300} className="z-[60]">
      <div className="p-4 flex flex-col h-full overflow-y-auto">
        <FormSupervisionComponent
          className="flex-1"
          submitControl={{
            path    :  `bookings/${booking.id}`,
            method  :  "PUT"
          }}
          defaultValue={{
            customer_name     :  booking.customer_name || "",
            customer_contact  :  booking.customer_contact || "",
            start_at          :  booking.start_at ? conversion.date(booking.start_at, "YYYY-MM-DDTHH:mm")  :  "",
            end_at            :  booking.end_at ? conversion.date(booking.end_at, "YYYY-MM-DDTHH:mm")      :  "",
            unit_id           :  booking.unit_id || ""
          }}
          payload={(v) => {
            if (editType === "customer") {
              return {
                customer_name    :  v.customer_name,
                customer_contact :  v.customer_contact,
              }
            } else if (editType === "schedule") {
              return {
                start_at : v.start_at,
                end_at   : v.end_at,
              }
            } else {
              return {
                unit_id  :  v.unit_id,
              }
            }
          }}
          onSuccess={() => {
            if (onSuccess) onSuccess();
            setTimeout(() => { onClose() }, 500);
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
              }
            ] : []),
            ...(editType === "unit" ? [
              {
                col: 12,
                type: "custom" as const,
                construction: ({ formControl, values }: any) => {
                  const ctrl = formControl("unit_id");
                  const startAt = values?.find((v: any) => v.name === "start_at")?.value;
                  const endAt = values?.find((v: any) => v.name === "end_at")?.value;

                  return (
                    <div className="mb-4">
                      <div className="mb-4">
                        <label className="input-label">Unit Sekarang</label>

                        <div className={cn("border bg-white rounded-lg px-4 py-3 flex items-center gap-3 transition-all w-full text-left relative")}>        
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                            style={{ backgroundColor: booking?.unit?.unit_category?.color || "#7b9cff" }}
                          >
                            <FontAwesomeIcon icon={faMobileAlt} className="text-lg" />
                          </div>
        
                          <div className="w-full">
                            <div className="flex justify-between items-center w-full">
                              <h4 className="text-on-surface font-bold text-base truncate">
                                {booking?.unit.unit_category?.name || "-"}
                              </h4>
                              <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">
                                {booking?.unit.code || "-"}
                              </p>
                            </div>
                            <div className="text-xs">{booking?.unit?.description || "-"}</div>
                          </div>
                        </div>
                      </div>

                      <UnitListSelectorComponent
                        value={ctrl.value}
                        invalid={ctrl.invalid}
                        onChange={(val) => ctrl.onChange(val)}
                        register={ctrl.register}
                        availableAt={`${startAt}|${endAt}`}
                        exceptId={ctrl.value}
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
