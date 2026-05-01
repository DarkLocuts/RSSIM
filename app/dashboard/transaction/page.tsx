"use client"

import { Suspense, useState } from "react";
import { HeadbarComponent, InputCheckboxComponent, InputComponent, TableSupervisionComponent } from "@components";
import { useAuthContext } from "@contexts";
import { useResponsive } from "@utils";

const typeLabels: Record<string, string> = {
  income:  "Pemasukan",
  expense: "Pengeluaran",
};



export default function TransactionPage() {
  const { user } = useAuthContext();

  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [filterOutlet, setFilterOutlet] = useState<any[]>([]);

  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Catat Transaksi" />

        <TableSupervisionComponent
          fetchControl={{
            path: "transaction-specials",
            params: { 
              expand: ["user", "payment_method"],
              filter: [
                ...(filterOutlet?.length > 0 ? [{ column: "outlet_id", type: "in", value: filterOutlet }] : [])
              ] as any[]
            },
            includeParams: {
              created_at: `${dateStart}|${dateEnd}`
            }
          }}
          columnControl={[
            {
              selector: "description",
              label: "Keterangan",
              sortable: false
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
              selector: "by",
              label: "Oleh",
              sortable: true,
              item: r => r?.user?.name
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
              ...(user?.role_id == 1 ? [{
                type: "select",
                construction: {
                  name                 :  "outlet_id",
                  label                :  "Outlet",
                  placeholder          :  "Pilih outlet",
                  serverOptionControl  :  {path: "outlets", params: {selectableOption: ["id", "name"]}},
                  validations          :  ["required"]
                }
              }] as any[] : []),
            ]
          }}
          controlBar={["CREATE", "SEARCH", , <FilterUnit key="filter-unit" dateStart={dateStart} dateEnd={dateEnd} setDateStart={setDateStart} setDateEnd={setDateEnd} setFilterOutlet={setFilterOutlet} />]}
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

const FilterUnit = ({ dateStart, dateEnd, setDateStart, setDateEnd, setFilterOutlet }: any) => {
  const { isSm } = useResponsive();
  const { user } = useAuthContext();

  if(isSm) {
    return (
      <>
        <div className="px-2 pb-20 w-full">
          <p className="text-sm mb-2">Tanggal Transaksi</p>
          <div className="flex flex-col gap-2 p-2 border rounded-lg">
            <InputComponent
              type="date"
              label={"Dari"}
              name="_start_date"
              value={dateStart}
              onChange={(v) => setDateStart(v)}
              placeholder="YYYY-MM-DD"
              className="md:py-1.5 md:text-sm"
            />
            <InputComponent
              type="date"
              label={"Sampai"}
              name="_end_date"
              value={dateEnd}
              onChange={(v) => setDateEnd(v)}
              placeholder="YYYY-MM-DD"
              className="md:py-1.5 md:text-sm"
            />
          </div>

          {user?.role_id == 1 && (
            <InputCheckboxComponent
              label="Outlet"
              name="_filter_outlet"
              serverOptionControl={{ path: "outlets", params: {selectableOption: ["id", "name"]} }}
              vertical
              onChange={(v) => setFilterOutlet(v)}
              className="max-h-[300px] label::mt-4"
            />
          )}
        </div>
      </>
    ) 
  } else {
    return <></>;
  }
}