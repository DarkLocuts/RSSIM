"use client"

import { BottomSheetComponent, FormSupervisionComponent, ButtonComponent } from "@components";
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";


interface AddPaymentSheetProps {
  show       :  boolean;
  onClose    :  () => void;
  bookingId  :  string;
  onSuccess  :  () => void;
}


export function AddPaymentSheetComponent({ show, onClose, bookingId, onSuccess }: AddPaymentSheetProps) {
  return (
    <BottomSheetComponent
      show={show}
      onClose={onClose}
      size={420}
    >
      <div className="px-5 pb-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Tambah Pembayaran</h2>

        <FormSupervisionComponent
          submitControl={{
            path    :  `bookings/${bookingId}/payments`,
            method  :  "POST",
          }}
          payload={async (values) => ({
            ...values,
            type: "payment",
          })}
          fields={[
            {
              type: "currency",
              construction: {
                name         :  "amount",
                label        :  "Jumlah Pembayaran",
                placeholder  :  "Masukkan jumlah",
                validations  :  ["required"],
              },
            },
            {
              type: "select",
              construction: {
                name                :  "payment_method_id",
                label               :  "Metode Pembayaran",
                placeholder         :  "Pilih metode pembayaran",
                serverOptionControl :  { path: "payment-methods", params: { selectableOption: ["id", "name"] } },
                validations         :  ["required"],
              },
            },
            {
              construction: {
                name         :  "note",
                label        :  "Keterangan",
                placeholder  :  "Keterangan (opsional)",
              },
            },
          ]}
          onSuccess={() => {
            onSuccess();
            setTimeout(() => { onClose() }, 500);
          }}
          footerControl={({ loading }) => (
            <ButtonComponent
              label="Simpan Pembayaran"
              icon={faMoneyBillWave}
              type="submit"
              loading={loading}
              block
              className="bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform mt-5"
            />
          )}
        />
      </div>
    </BottomSheetComponent>
  );
}
