import ExcelJS from "exceljs";
import { TransactionItem } from "../_structures/TransactionList.component";

// ==============================>
// ## Export to Excel
// ==============================>
export interface ExportReportParams {
  transactions  :  TransactionItem[];
  dateFrom      :  string;
  dateTo        :  string;
}

export const exportReportToExcel = async ({ transactions, dateFrom, dateTo }: ExportReportParams) => {
  const workbook  =  new ExcelJS.Workbook();
  const sheet     =  workbook.addWorksheet("Laporan Keuangan");

  // ── Header info ────────────────────────────────
  sheet.mergeCells("A1:E1");
  sheet.getCell("A1").value       =  "Laporan Keuangan";
  sheet.getCell("A1").font        =  { bold: true, size: 14 };
  sheet.getCell("A1").alignment   =  { horizontal: "center" };

  sheet.mergeCells("A2:E2");
  sheet.getCell("A2").value       =  `Periode: ${dateFrom} s/d ${dateTo}`;
  sheet.getCell("A2").alignment   =  { horizontal: "center" };
  sheet.getCell("A2").font        =  { italic: true, color: { argb: "FF666666" } };

  sheet.addRow([]);

  // ── Column definitions ─────────────────────────
  sheet.columns = [
    { key: "label",    width: 32 },
    { key: "customer", width: 22 },
    { key: "method",   width: 18 },
    { key: "type",     width: 14 },
    { key: "amount",   width: 20 },
    { key: "date",     width: 22 },
  ];

  // ── Table header row ───────────────────────────
  const headerRow = sheet.addRow(["Keterangan", "Pelanggan", "Metode", "Tipe", "Jumlah", "Tanggal"]);
  headerRow.eachCell((cell) => {
    cell.font            =  { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill            =  { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
    cell.alignment       =  { horizontal: "center" };
    cell.border          =  { bottom: { style: "thin", color: { argb: "FFDDDDDD" } } };
  });

  // ── Data rows ──────────────────────────────────
  let totalIncome   =  0;
  let totalExpense  =  0;

  transactions.forEach((tx) => {
    const isIncome  =  tx.type === "income";
    const row       =  sheet.addRow([
      tx.label,
      tx.customer || "-",
      tx.method,
      isIncome ? "Pemasukan" : "Pengeluaran",
      isIncome ? tx.amount : -tx.amount,
      tx.date,
    ]);

    // Amount cell — number format
    const amountCell           =  row.getCell(5);
    amountCell.numFmt          =  '"Rp "#,##0';
    amountCell.font            =  { color: { argb: isIncome ? "FF005A3C" : "FFB31B25" }, bold: true };

    if (isIncome) totalIncome  +=  tx.amount;
    else          totalExpense +=  tx.amount;
  });

  // ── Summary footer ─────────────────────────────
  sheet.addRow([]);

  const incomeRow   =  sheet.addRow(["", "", "", "Total Pemasukan",  totalIncome,  ""]);
  const expenseRow  =  sheet.addRow(["", "", "", "Total Pengeluaran", -totalExpense, ""]);
  const netRow      =  sheet.addRow(["", "", "", "Net Pendapatan",   totalIncome - totalExpense, ""]);

  [incomeRow, expenseRow, netRow].forEach((row, idx) => {
    const labelCell   =  row.getCell(4);
    const amountCell  =  row.getCell(5);

    labelCell.font   =  { bold: true };
    amountCell.numFmt    =  '"Rp "#,##0';
    amountCell.font  =  {
      bold   :  true,
      color  :  { argb: idx === 0 ? "FF005A3C" : idx === 1 ? "FFB31B25" : "FF1D4ED8" },
    };
  });

  // ── Download ───────────────────────────────────
  const buffer  =  await workbook.xlsx.writeBuffer();
  const blob    =  new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url     =  URL.createObjectURL(blob);
  const anchor  =  document.createElement("a");

  anchor.href     =  url;
  anchor.download =  `laporan-keuangan_${dateFrom}_${dateTo}.xlsx`;
  anchor.click();

  URL.revokeObjectURL(url);
};
