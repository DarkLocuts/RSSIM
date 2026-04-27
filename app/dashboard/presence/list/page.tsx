"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";
import { conversion } from "@/utils";

export default function PresencePage() {
  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Absensi" />

        <TableSupervisionComponent
          fetchControl={{
            path: "presences",
            params: { expand: ["user"] },
          }}
          columnControl={[
            {
              selector: "employee",
              label: "Karyawan",
              sortable: true
            },
            {
              selector: "date",
              label: "Tanggal",
              sortable: true
            },
            {
              selector: "check_in",
              label: "Check In",
              item: (r) => r.check_in || "-",
              sortable: true
            },
            {
              selector: "check_out",
              label: "Check Out",
              item: (r) => r.check_out || "-",
              sortable: true
            },
          ]}
          formControl={{
            fields: [
              {
                type: "select",
                construction: {
                  name                 :  "user_id",
                  label                :  "Karyawan",
                  placeholder          :  "Pilih Karyawan",
                  serverOptionControl  :  {path: "users", params: {selectableOption: ["id", "name"]}},
                  validations          :  ["required"]
                }
              },
              {
                construction: {
                  type: "date",
                  name: "date",
                  label: "Tanggal",
                  placeholder: "Pilih tanggal",
                  validations: ["required"]
                }
              },
              {
                construction: {
                  type: "time",
                  name: "check_in",
                  label: "Check In",
                  placeholder: "Pilih waktu check in",
                  validations: ["required"]
                }
              },
              {
                construction: {
                  type: "time",
                  name: "check_out",
                  label: "Check Out",
                  placeholder: "Pilih waktu check out",
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
                const hasCheckOut = !!row.check_out;
                return (
                  <div className="border bg-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors w-full">
                    <div className="flex-grow min-w-0">
                      <h4 className="text-on-surface font-bold text-base truncate">{row?.user?.name || "Unknown"}</h4>
                      <p className="text-sm text-on-surface-variant mt-0.5">{row.date ? conversion.date(row.date, "DD MMMM YYYY") : "-"}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="font-semibold text-success">{row.check_in ? conversion.date(conversion.date(row.date, "YYYY-MM-DD") + "T" + row.check_in, "HH:mm") : "--:--"}</span>
                        <span className="">→</span>
                        <span className={`font-semibold ${hasCheckOut ? "text-success" : "text-light-foreground"}`}>
                          {row.check_out ? conversion.date(conversion.date(row.date, "YYYY-MM-DD") + "T" + row.check_out, "HH:mm") : "--:--"}
                        </span>
                      </div>
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
