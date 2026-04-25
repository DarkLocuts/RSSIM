"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserClock } from "@fortawesome/free-solid-svg-icons";

export default function PresencePage() {
  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Absensi" />

        <TableSupervisionComponent
          fetchControl={{
            path: "presences",
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faUserClock} className="text-sm text-[#006947]" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-on-surface font-bold text-base truncate">{row.employee || "Unknown"}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{row.date || "-"}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-[#006947]">{row.check_in || "--:--"}</span>
                        <span className="text-[#9eaec7]">→</span>
                        <span className="font-semibold" style={{ color: hasCheckOut ? "#006947" : "#9eaec7" }}>
                          {row.check_out || "--:--"}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 inline-block"
                        style={{
                          backgroundColor: hasCheckOut ? "#69f6b8" : "rgb(248 160 16 / 0.2)",
                          color: hasCheckOut ? "#005a3c" : "#4a2c00"
                        }}
                      >
                        {hasCheckOut ? "Selesai" : "Aktif"}
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
