"use client"

import { useState } from "react";
import { HeadbarComponent } from "@/components";
import { ReportSummaryComponent } from "./_structures/ReportSummary.component";
import { TransactionListComponent } from "./_structures/TransactionList.component";
import { useReportService } from "./_services/report.service";

// ==============================>
// ## Date helper — YYYY-MM-DD
// ==============================>
const toDateInput = (date: Date): string => date.toISOString().slice(0, 10);

const today = toDateInput(new Date());

export default function ReportPage() {
  const [dateFrom, setDateFrom]  =  useState<string>(today);
  const [dateTo, setDateTo]      =  useState<string>(today);

  const { summary, transactions, loading } = useReportService(dateFrom, dateTo);

  return (
    <div className="px-2">
      <HeadbarComponent title="Laporan Keuangan" />

      {/* Date Filter */}
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
      </div>

      <ReportSummaryComponent summary={summary} loading={loading} transactions={transactions} dateFrom={dateFrom} dateTo={dateTo} />

      <TransactionListComponent transactions={transactions} loading={loading} />
    </div>
  );
}
