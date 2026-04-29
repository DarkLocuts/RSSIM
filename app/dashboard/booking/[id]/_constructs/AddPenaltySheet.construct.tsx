"use client"

import { BottomSheetComponent, FormSupervisionComponent, ButtonComponent, TabbarComponent, InputNumberComponent, InputCurrencyComponent, InputComponent } from "@components";
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
            path    :  `bookings/${bookingId}/charge`,
            method  :  "POST",
          }}
          payload={async (values) => ({
            ...values,
          })}
          fields={[
            {
              type: "custom",
              construction({ formControl }) {
                return (
                  <div className="w-full">
                    <TabbarComponent 
                      items={[
                        {
                          label: "Jam",
                          value: "HOURLY",
                        },
                        {
                          label: "Hari",
                          value: "DAILY",
                        },
                        {
                          label: "Lainnya",
                          value: "OTHER",
                        }
                      ]}
                      onChange={(selected) => formControl("type").onChange(selected)}
                      active={formControl("type").value}
                      className="item::text-sm"
                    />

                    {formControl("type").value == "HOURLY" && (
                      <div className="w-full mt-4">
                        <InputNumberComponent
                          type="number"
                          label="Jumlah"
                          placeholder="Masukkan jumlah jam"
                          validations={["required"]}
                          {...formControl("hourly")}
                        />
                      </div>
                    )}

                    {formControl("type").value == "DAILY" && (
                      <div className="w-full mt-4">
                        <InputNumberComponent
                          type="number"
                          label="Jumlah"
                          placeholder="Masukkan jumlah hari"
                          validations={["required"]}
                          {...formControl("daily")}
                        />
                      </div>
                    )}

                    {formControl("type").value == "OTHER" && (
                      <>
                        <div className="w-full mt-4">
                          <InputComponent
                            label="Keterangan"
                            placeholder="Masukkan keterangan denda"
                            validations={["required"]}
                            {...formControl("description")}
                          />
                        </div>

                        <div className="w-full mt-3">
                          <InputCurrencyComponent
                            label="Jumlah"
                            placeholder="Masukkan jumlah denda"
                            validations={["required"]}
                            {...formControl("amount")}
                          />
                        </div>
                      </>
                    )}
                  </div> 
                )
              },
            },
            // {
            //   type: "currency",
            //   construction: {
            //     name         :  "amount",
            //     label        :  "Jumlah Denda",
            //     placeholder  :  "Masukkan jumlah denda",
            //     validations  :  ["required"],
            //   },
            // },
            // {
            //   construction: {
            //     name         :  "note",
            //     label        :  "Alasan Denda",
            //     placeholder  :  "Masukkan alasan denda",
            //     validations  :  ["required", "max:500"],
            //   },
            // },
          ]}
          onSuccess={() => {
            onSuccess();
            setTimeout(() => { onClose() }, 500);
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
