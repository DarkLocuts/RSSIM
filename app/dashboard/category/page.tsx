"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt } from "@fortawesome/free-solid-svg-icons";
import { conversion } from "@/utils";

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
                  <div className="border bg-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors w-full">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                      style={{ backgroundColor: row.color || "#7b9cff" }}
                    >
                      <FontAwesomeIcon icon={faMobileAlt} className="text-lg" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-on-surface font-bold text-base truncate">{row.name || "Unknown"}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {row.price ? conversion.currency(row.price) : "-"} / hari
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {row.hourly_price ? conversion.currency(row.hourly_price) : "-"} / jam
                      </p>
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
