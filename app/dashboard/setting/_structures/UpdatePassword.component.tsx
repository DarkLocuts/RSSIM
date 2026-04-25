"use client"

import { BottomSheetComponent, FormSupervisionComponent, ButtonComponent } from "@components";
import { faLock } from "@fortawesome/free-solid-svg-icons";

interface ChangePasswordStructureProps {
  show: boolean;
  onClose: () => void;
}

export const UpdatePasswordComponent = ({
  show,
  onClose,
}: ChangePasswordStructureProps) => {
  return (
    <BottomSheetComponent
      show={show}
      onClose={onClose}
      size={410}
    >
      <div className="px-5 pb-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Ubah Password</h2>

        <FormSupervisionComponent
          submitControl={{
            path: "me/update-password",
            method: "PUT",
          }}
          fields={[
            {
              construction: {
                type: "password",
                name: "old_password",
                label: "Password Lama",
                placeholder: "Masukkan password lama",
                validations: "required",
              }
            },
            {
              type: "enter-password",
              construction: {
                name: "new_password",
                label: "Password Baru",
                placeholder: "Masukkan password baru",
                validations: "required|min:8"
              }
            },
          ]}
          onSuccess={() => onClose()}
          footerControl={({ loading }) => (
            <ButtonComponent
              type="submit"
              loading={loading}
              variant="solid"
              paint="primary"
              block
              size="lg"
              icon={faLock}
              label={"Simpan"}
              className="bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform mt-5"
            />
          )}
        />
      </div>
    </BottomSheetComponent>
  );
};
