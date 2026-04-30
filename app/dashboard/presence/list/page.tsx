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
            defaultValue(item) {
              return item?.id ? {
                ...item,
                date: conversion.date(item?.date, "YYYY-MM-DD"),
              } : {}
            },
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
          detailControl={(row) => {
            const storageHost = process.env.NEXT_PUBLIC_STORAGE_HOST;
            const checkInImageUrl  = row?.check_in_image  ? `${storageHost}/${row.check_in_image}`  : null;
            const checkOutImageUrl = row?.check_out_image ? `${storageHost}/${row.check_out_image}` : null;

            const handleDownload = (url: string, filename: string) => {
              const a = document.createElement("a");
              a.href = url;
              a.download = filename;
              a.target = "_blank";
              a.click();
            };

            return (
              <div className="flex flex-col gap-4">
                {/* ── Info rows ── */}
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-xs font-semibold text-light-foreground">Karyawan</div>
                    <div className="font-semibold">{row?.user?.name || row?.employee || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-light-foreground">Tanggal</div>
                    <div className="font-semibold">{row?.date ? conversion.date(row.date, "DD MMMM YYYY") : "-"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs font-semibold text-light-foreground">Check In</div>
                      <div className="font-semibold text-success">{row?.check_in || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-light-foreground">Check Out</div>
                      <div className={`font-semibold ${row?.check_out ? "text-success" : "text-light-foreground"}`}>{row?.check_out || "-"}</div>
                    </div>
                  </div>
                </div>

                {/* ── Photo previews ── */}
                {(checkInImageUrl || checkOutImageUrl) && (
                  <div className="flex flex-col gap-3">
                    <div className="text-xs font-semibold text-light-foreground uppercase tracking-wide">Foto Presensi</div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Check In Photo */}
                      <div className="flex flex-col gap-1.5">
                        <div className="text-xs font-semibold text-on-surface-variant">Check In</div>
                        {checkInImageUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border bg-surface aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={checkInImageUrl}
                              alt="Foto Check In"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => handleDownload(checkInImageUrl, `check-in-${row?.date || "foto"}.jpg`)}
                                className="bg-white text-on-surface text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-surface transition"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border bg-surface aspect-square flex items-center justify-center text-xs text-light-foreground">
                            Tidak ada foto
                          </div>
                        )}
                      </div>

                      {/* Check Out Photo */}
                      <div className="flex flex-col gap-1.5">
                        <div className="text-xs font-semibold text-on-surface-variant">Check Out</div>
                        {checkOutImageUrl ? (
                          <div className="relative group rounded-xl overflow-hidden border bg-surface aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={checkOutImageUrl}
                              alt="Foto Check Out"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => handleDownload(checkOutImageUrl, `check-out-${row?.date || "foto"}.jpg`)}
                                className="bg-white text-on-surface text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-surface transition"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl border bg-surface aspect-square flex items-center justify-center text-xs text-light-foreground">
                            Tidak ada foto
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
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
