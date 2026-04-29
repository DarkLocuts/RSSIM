"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";

export default function OutletPage() {
  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Metode Pembayaran" />

        <TableSupervisionComponent
          fetchControl={{
            path: "payment-methods",
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
              selector: "description",
              label: "Keterangan",
              sortable: true
            },
          ]}
          formControl={{
            modalControl: { size: 300 },
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
                  name: "description",
                  label: "Keterangan",
                  placeholder: "Masukkan nomor rekening / VA / dll",
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
                      <h4 className="text-on-surface font-bold text-base truncate">{row.name || "-"}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 truncate">{row.description || "-"}</p>
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
