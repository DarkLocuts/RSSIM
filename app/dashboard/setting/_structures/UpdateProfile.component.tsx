"use client"

import { BottomSheetComponent, FormSupervisionComponent } from "@components";
import { useAuthContext } from "@contexts";


export const UpdateProfileComponent = ({ show, onClose }: {
  show     :  boolean;
  onClose  :  () => void;
}) => {
  const { user, setUser }  =  useAuthContext()
  
  return (
    <BottomSheetComponent
      show={show}
      onClose={onClose}
      size={400}
    >
      <div className="px-5 pb-6">
        <h2 className="text-lg font-bold text-on-surface mb-4">Ubah Profil</h2>

        <FormSupervisionComponent
          submitControl={{
            path    :  "me",
            method  :  "PUT",
          }}
          defaultValue={{
            name     :  user?.name,
            contact  :  user?.contact,
            address  :  user?.address
          }}
          fields={[
            {
              construction: {
                name: "name",
                label: "Nama Lengkap",
                placeholder: "Masukkan nama lengkap",
              }
            },
            {
              construction: {
                name: "contact",
                label: "Kontak",
                placeholder: "Masukkan kontak",
              }
            },
            {
              construction: {
                name: "address",
                label: "Alamat",
                placeholder: "Masukkan alamat",
              }
            }
          ]}
          onSuccess={(res) => {
            setUser({...user, name: res.data?.name, contact: res.data?.contact, address: res.data?.address});
            setTimeout(() => onClose(), 1000)
          }}
          // footerControl={({ loading }) => (
          //   <ButtonComponent
          //     label="Simpan"
          //     icon={faFloppyDisk}
          //     type="submit"
          //     loading={loading}
          //     block
          //     className="bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform mt-5"
          //   />
          // )}
        />
      </div>
    </BottomSheetComponent>
  );
};
