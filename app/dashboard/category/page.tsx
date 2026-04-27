"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";
import { conversion } from "@/utils";
import UnitCategoryCardComponent from "./_constructs/UnitCategoryCard.component";

export default function CategoryPage() {
  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Jenis Unit" />

        <TableSupervisionComponent
          fetchControl={{
            path: "unit-categories",
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
              selector: "identity_color",
              label: "Warna",
              item: (r) => (
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full inline-block border border-gray-200"
                    style={{ backgroundColor: r.identity_color || "#ccc" }}
                  />
                  <span className="text-xs">{r.identity_color || "-"}</span>
                </div>
              ),
            },
            {
              selector: "price",
              label: "Harga /Hari",
              item: (r) => r.price ? conversion.currency(r.price) : "-",
              sortable: true
            },
            {
              selector: "hourly_price",
              label: "Harga /Jam",
              item: (r) => r.hourly_price ? conversion.currency(r.hourly_price) : "-",
              sortable: true
            },
          ]}
          formControl={{
            fields: [
              {
                construction: {
                  name: "name",
                  label: "Nama Kategori",
                  placeholder: "Masukkan nama kategori (misal: iPhone 15 Pro)",
                  validations: ["required", "max:200"]
                }
              },
              {
                construction: {
                  type: "color",
                  name: "color",
                  label: "Tanda Warna",
                  placeholder: "Pilih tanda warna",
                  validations: ["required", "max:20"]
                }
              },
              {
                type: "currency",
                construction: {
                  name: "price",
                  label: "Harga Sewa /Hari",
                  placeholder: "Masukkan harga sewa",
                  validations: ["required"]
                }
              },
              {
                type: "currency",
                construction: {
                  name: "hourly_price",
                  label: "Harga Sewa /Jam",
                  placeholder: "Masukkan harga sewa",
                  validations: ["required"]
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
                  <div className="border bg-white rounded-lg px-4 py-3 transition-colors w-full">
                    <UnitCategoryCardComponent data={row} />
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
