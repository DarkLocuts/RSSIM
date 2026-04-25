"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";

export default function UserPage() {
  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Akun / Karyawan" />

        <TableSupervisionComponent
          fetchControl={{
            path: "users",
            params: { expand: ["role", "outlet"] }
          }}
          columnControl={[
            {
              selector: "name",
              label: "Nama",
              sortable: true
            },
            {
              selector: "username",
              label: "Username",
              sortable: true
            },
            {
              selector: "role",
              label: "Role",
              item: (r) => r.role?.name || "-",
              sortable: true
            },
            {
              selector: "outlet",
              label: "Outlet",
              item: (r) => r.outlet?.name || "-",
              sortable: true
            },
          ]}
          formControl={{
            fields: [
              {
                construction: {
                  name: "name",
                  label: "Nama",
                  placeholder: "Masukkan nama",
                  validations: ["required", "max:200"]
                }
              },
              {
                construction: {
                  name: "username",
                  label: "Username",
                  placeholder: "Masukkan username",
                  validations: ["required", "max:100"]
                }
              },
              {
                type: "enter-password",
                construction: {
                  name: "password",
                  label: "Password",
                  placeholder: "Masukkan password",
                  validations: ["required", "max:100"],
                },
                visibility: "create",
              },
              {
                type: "radio",
                construction: {
                  name: "role_id",
                  label: "Role",
                  options: [
                    {
                      label: "Owner",
                      value: 1
                    },
                    {
                      label: "Admin",
                      value: 2
                    },
                    {
                      label: "Petugas",
                      value: 3
                    },
                  ],
                  validations: ["required"]
                }
              },
              {
                type: "select",
                construction: {
                  name                 :  "outlet_id",
                  label                :  "Outlet",
                  placeholder          :  "Pilih Outlet",
                  serverOptionControl  :  {path: "outlets", params: {selectableOption: ["id", "name"]}},
                  validations          :  ["required"]
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
              },
            ]
          }}
          controlBar={["CREATE", "SEARCH"]}
          detailControl={false}
          block
          responsiveControl={{
            mobile: {
              item: (row) => {
                return (
                  <div className="border bg-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors w-full">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                      {(row.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-on-surface font-bold text-base truncate">{row.name || "Unknown User"}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5"><b>@{row.username || "-"}</b> | {row.outlet?.name || "outlet"}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-[10px] font-semibold text-primary bg-cyan-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        {row.role?.name || "-"}
                      </span>
                    </div>
                  </div>
                );
              },
            }
          }}
        />
      </div>
    </Suspense>
  );
}
