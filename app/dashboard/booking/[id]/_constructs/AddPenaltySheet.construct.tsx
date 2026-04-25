"use client"

import { BottomSheetComponent, FormSupervisionComponent, ButtonComponent } from "@components";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";


interface AddPenaltySheetProps {
  show       :  boolean;
  onClose    :  () => void;
  bookingId  :  string;
  onSuccess  :  () => void;
}


export function AddPenaltySheetComponent({ show, onClose, bookingId, onSuccess }: AddPenaltySheetProps) {
  return (
    <BottomSheetComponent
      show={show}
      onClose={onClose}
      size={420}
    >
      <div className="px-5 pb-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Tambah Denda</h2>

        <FormSupervisionComponent
          submitControl={{
            path    :  `bookings/${bookingId}/payments`,
            method  :  "POST",
          }}
          payload={async (values) => ({
            ...values,
            type: "penalty",
          })}
          fields={[
            {
              type: "currency",
              construction: {
                name         :  "amount",
                label        :  "Jumlah Denda",
                placeholder  :  "Masukkan jumlah denda",
                validations  :  ["required"],
              },
            },
            {
              construction: {
                name         :  "note",
                label        :  "Alasan Denda",
                placeholder  :  "Masukkan alasan denda",
                validations  :  ["required", "max:500"],
              },
            },
          ]}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          footerControl={({ loading }) => (
            <ButtonComponent
              label="Simpan Denda"
              icon={faExclamationTriangle}
              type="submit"
              loading={loading}
              block
              className="bg-danger text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-200 active:scale-[0.98] transition-transform mt-5"
            />
          )}
        />
      </div>
    </BottomSheetComponent>
  );
}
