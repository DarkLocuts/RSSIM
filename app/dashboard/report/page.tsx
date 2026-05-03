"use client"

import { useState, useMemo } from "react";
import { HeadbarComponent } from "@/components";
import { ReportSummaryComponent } from "./_structures/ReportSummary.component";
import { TransactionListComponent } from "./_structures/TransactionList.component";
import { useReportService } from "./_services/report.service";
import { useAuthContext } from "@/contexts";
import { useGetApi } from "@/utils";

// ==============================>
// ## Date helper — YYYY-MM-DD
// ==============================>
const toDateInput = (date: Date): string => date.toISOString().slice(0, 10);

const today = toDateInput(new Date());

export default function ReportPage() {
  const { user } = useAuthContext();
  const [dateFrom, setDateFrom]            =  useState<string>(today);
  const [dateTo, setDateTo]                =  useState<string>(today);
  const [filterOutlet, setFilterOutlet]    =  useState<string>("");
  const [filterPayment, setFilterPayment]  =  useState<string>("");

  const { summary, transactions, loading } = useReportService(dateFrom, dateTo, filterOutlet || undefined, filterPayment || undefined);

  // Fetch outlets for filter (owner only)
  const outletConfig = useMemo(() => ({
    path: "outlets",
    headers: { "X-Option": 1 },
    params: { selectableOption: ["id", "name"] },
  }), []);

  const { data: outletsData } = useGetApi(outletConfig);

  const outlets = outletsData?.data?.data || outletsData?.data || [];

  const paymentConfig = useMemo(() => ({
    path: "payment-methods",
    headers: { "X-Option": 1 },
    params: { selectableOption: ["id", "name"] },
  }), []);

  const { data: paymentsData } = useGetApi(paymentConfig);
  const paymentMethods = paymentsData?.data?.data || paymentsData?.data || [];

  return (
    <div className="px-2">
      <HeadbarComponent title="Laporan Keuangan" />

      {/* Date & Extra Filters */}
      <div className="rounded-xl p-4 mb-4 bg-white border">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Filter Tanggal</p>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-light-foreground font-medium block mb-1">Dari</label>
            <input
              type="date"
              value={dateFrom}
              max={dateTo}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-light-foreground font-medium block mb-1">Sampai</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          {/* Outlet filter - owner only */}
          {user?.role_id == 1 && outlets.length > 0 && (
            <div className="flex-1">
              <label className="text-xs text-light-foreground font-medium block mb-1">Cabang</label>
              <select
                value={filterOutlet}
                onChange={(e) => setFilterOutlet(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Semua Cabang</option>
                {outlets.map((o: any) => (
                  <option key={o.value || o.id} value={o.value || o.id}>{o.label || o.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Payment method filter */}
          <div className="flex-1">
            <label className="text-xs text-light-foreground font-medium block mb-1">Metode Bayar</label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Semua Metode</option>
              {paymentMethods.map((pm: any) => (
                <option key={pm.value || pm.id} value={pm.value || pm.id}>{pm.label || pm.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ReportSummaryComponent summary={summary} loading={loading} transactions={transactions} dateFrom={dateFrom} dateTo={dateTo} />

      <TransactionListComponent transactions={transactions} loading={loading} />
    </div>
  );
}
