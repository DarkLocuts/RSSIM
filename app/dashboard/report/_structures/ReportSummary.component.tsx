"use client"

import { useState } from "react";
import { exportReportToExcel } from "../_services/export-report.service";
import { TransactionItem } from "./TransactionList.component";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { ButtonComponent } from "@/components";

// ==============================>
// ## Report Summary Component
// ==============================>
interface ReportSummaryProps {
  summary  :  { total_revenue: number; total_income: number; total_expense: number } | null;
  loading  :  boolean;
  transactions  :  TransactionItem[];
  dateFrom      :  string;
  dateTo        :  string;
}

const formatCurrency = (amount: number) =>
  `Rp ${Number(amount || 0).toLocaleString("id-ID")}`;

export function ReportSummaryComponent({ summary, loading, transactions, dateFrom, dateTo }: ReportSummaryProps) {
  const [exporting, setExporting]  =  useState(false);

  const handleExport = async () => {
    setExporting(true);
    await exportReportToExcel({ transactions, dateFrom, dateTo });
    setExporting(false);
  };

  return (
    <div className="rounded-t-xl p-4 bg-white border">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Ringkasan Pendapatan</p>
      <h2 className="text-2xl font-bold text-primary mb-4">
        {loading ? "..." : formatCurrency(summary?.total_revenue ?? 0)}
      </h2>

      <div className="flex gap-2">
        <div className="flex-1 rounded-lg px-3 py-2 border">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-xs text-foreground font-semibold">Pemasukan</p>
          </div>
          <p className="text-sm font-bold text-secondary">
            {loading ? "..." : formatCurrency(summary?.total_income ?? 0)}
          </p>
        </div>
        <div className="flex-1 rounded-lg px-3 py-2 border">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-xs text-foreground font-semibold">Pengeluaran</p>
          </div>
          <p className="text-sm font-bold text-danger">
            {loading ? "..." : formatCurrency(summary?.total_expense ?? 0)}
          </p>
        </div>
      </div>

      <ButtonComponent 
        label={exporting ? "Mengekspor..." : "Export Laporan"}
        icon={faFileExcel}
        onClick={handleExport}
        loading={exporting}
        disabled={loading || transactions.length === 0}
        block
        variant="outline"
        className="mt-4 rounded-xl"
      />
    </div>
  );
}
