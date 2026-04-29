"use client"

import { Suspense } from "react";
import { HeadbarComponent, TableSupervisionComponent } from "@components";

const typeLabels: Record<string, string> = {
  income:  "Pemasukan",
  expense: "Pengeluaran",
};

export default function TransactionPage() {
  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Catat Transaksi" />

        <TableSupervisionComponent
          fetchControl={{
            path: "transaction-specials",
            params: { expand: ["user", "payment_method"] }
          }}
          columnControl={[
            {
              selector: "type",
              label: "Tipe",
              item: (r) => {
                return (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${r?.type == "income" ? "bg-success" : "bg-danger"}`}>
                    {typeLabels[r.type] || r.type || "-"}
                  </span>
                );
              },
              sortable: true
            },
            {
              selector: "amount",
              label: "Jumlah",
              item: (r) => {
                const isIncome = r.type === "income";
                return (
                  <span style={{ color: isIncome ? "#005a3c" : "#b31b25", fontWeight: 600 }}>
                    {isIncome ? "+" : "-"}Rp {Number(r.amount || 0).toLocaleString("id-ID")}
                  </span>
                );
              },
              sortable: true
            },
            {
              selector: "description",
              label: "Keterangan",
              sortable: false
            },
            {
              selector: "by",
              label: "Oleh",
              sortable: true
            },
          ]}
          formControl={{
            payload: (v) => ({
              description        :  v?.description,
              type               :  v?.type,
              amount             :  v?.amount,
              payment_method_id  :  v?.payment_method_id,
            }),
            fields: [
              {
                construction: {
                  name: "description",
                  label: "Keterangan",
                  placeholder: "Masukkan keterangan transaksi",
                  validations: ["required", "max:500"]
                }
              },
              {
                type: "radio",
                construction: {
                  name: "type",
                  label: "Jenis",
                  options: [
                    {
                      label: "Pemasukan",
                      value: "income"
                    },
                    {
                      label: "Pengeluaran",
                      value: "outcome"
                    }
                  ],
                  validations: ["required"]
                }
              },
              {
                type: "currency",
                construction: {
                  name: "amount",
                  label: "Jumlah",
                  placeholder: "Masukkan jumlah",
                  validations: ["required"]
                }
              },
              {
                type: "select",
                construction: {
                  name: "payment_method_id",
                  label: "Metode Pembayaran",
                  placeholder: "Pilih Metode Pembayaran",
                  serverOptionControl: { path: "payment-methods", params: { selectableOption: ["id", "name"] } },
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
                    <div className="flex-grow min-w-0">
                      <h4 className="text-on-surface font-bold text-base truncate">{row.description || "Tanpa keterangan"}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{row.payment_method?.name || "-"} | Oleh {row.user?.name || "-"}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[10px] font-semibold mt-0.5">
                        {typeLabels[row.type] || "-"}
                      </p>
                      <span className={`text-sm font-bold ${row?.type == "income" ? "text-success" : "text-danger"}`}>
                        {row?.type == "income" ? "+" : "-"}Rp {Number(row.amount || 0).toLocaleString("id-ID")}
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
