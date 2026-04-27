"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";
import { UnitStatusComponent } from "@app";
import UnitCategoryCardComponent from "../category/_constructs/UnitCategoryCard.component";

export default function ProductPage() {
  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Unit" noBtnBack />

        <TableSupervisionComponent
          fetchControl={{
            path: "units",
            params: { expand: ["unit_category"] }
          }}
          columnControl={[
            {
              selector: "code",
              label: "Kode",
              sortable: true
            },
            {
              selector: "unit_category_id",
              label: "Jenis Unit",
              item: (r) => r.unit_category?.name || "-",
            },
            // {
            //   selector: "specification",
            //   label: "Spesifikasi",
            //   sortable: false
            // },
            // {
            //   selector: "status",
            //   label: "Status",
            //   item: (r) => {
            //     const colors = statusColors[r.status] || { bg: "#e5e7eb", text: "#374151" };
            //     return (
            //       <span
            //         className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            //         style={{ backgroundColor: colors.bg, color: colors.text }}
            //       >
            //         {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "-"}
            //       </span>
            //     );
            //   },
            //   sortable: true
            // },
          ]}
          formControl={{
            fields: [
              {
                type: "select",
                construction: {
                  name                 :  "unit_category_id",
                  label                :  "Jenis Unit",
                  placeholder          :  "Pilih jenis unit",
                  serverOptionControl  :  {path: "unit-categories", params: {selectableOption: ["id", "name"]}},
                  validations          :  ["required"]
                }
              },
              {
                construction: {
                  name: "description",
                  label: "Deskripsi",
                  placeholder: "Masukkan deskripsi unit", 
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
                  <div className="border bg-white rounded-lg w-full">
                    <div className="w-full flex justify-between items-center px-4 py-2 border-b ">
                      <div className="text-sm font-semibold">#{row.code}</div>
                      <UnitStatusComponent status={row.status || "UNAVAILABLE"} />
                    </div>
                    <div className="px-4 py-4">
                      <UnitCategoryCardComponent data={row.unit_category} />
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
