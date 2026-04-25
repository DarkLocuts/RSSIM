"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";

export default function OutletPage() {
  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Cabang" />

        <TableSupervisionComponent
          fetchControl={{
            path: "outlets",
          }}
          columnControl={[
            {
              selector: "code",
              label: "Kode",
              sortable: true
            },
            {
              selector: "name",
              label: "Nama",
              sortable: true
            },
            {
              selector: "address",
              label: "Alamat",
              sortable: true
            },
          ]}
          formControl={{
            fields: [
              {
                construction: {
                  name: "code",
                  label: "Kode Outlet",
                  placeholder: "Masukkan kode outlet",
                  validations: ["required", "max:50"]
                }
              },
              {
                construction: {
                  name: "name",
                  label: "Nama Outlet",
                  placeholder: "Masukkan nama outlet",
                  validations: ["required", "max:200"]
                }
              },
              {
                construction: {
                  name: "address",
                  label: "Alamat",
                  placeholder: "Masukkan alamat outlet",
                  validations: ["required", "max:500"]
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
                    <div className="flex-grow min-w-0">
                      <h4 className="text-on-surface font-bold text-base truncate">{row.name || "Unknown Outlet"}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{row.address || "-"}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-[10px] font-semibold text-primary bg-cyan-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        {row.code || "-"}
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
