"use client"

import { conversion } from "@/utils";

// ==============================>
// ## Transaction type
// ==============================>
export interface TransactionItem {
  id        :  string | number;
  label     :  string;
  customer  :  string;
  amount    :  number;
  type      :  "income" | "expense";
  method    :  string;
  date      :  string;
  icon_hint ?:  "cash" | "transfer" | "card";
}

// ==============================>
// ## Transaction List Component
// ==============================>
interface TransactionListProps {
  transactions  :  TransactionItem[];
  loading       :  boolean;
}

export function TransactionListComponent({ transactions, loading }: TransactionListProps) {
  return (
    <div className="mb-6 bg-white rounded-b-xl border border-t-0 p-4 pb-6">

      {/* Header row — label + export button */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Riwayat
        </p>
        
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="text-right space-y-2 shrink-0">
                <div className="h-3 bg-gray-100 rounded w-20" />
                <div className="h-2 bg-gray-100 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && transactions.length === 0 && (
        <div className="text-center py-10 text-sm text-light-foreground">
          Tidak ada transaksi pada rentang tanggal ini.
        </div>
      )}

      {/* Transaction rows */}
      {!loading && transactions.length > 0 && (
        <>
          <div className="flex flex-col gap-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-2 pt-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">{tx.label}</h4>
                  <p className="text-xs text-light-foreground mt-0.5">
                    {tx.method} • {tx.customer || "-"}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${tx.type === "income" ? "text-primary" : "text-danger"}`}>
                    {tx.type === "income" ? "+" : "-"} {conversion.currency(tx.amount)}
                  </p>
                  <p className="text-xs text-light-foreground mt-0.5">{conversion.date(tx.date, "DD MMMM HH:mm")}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
