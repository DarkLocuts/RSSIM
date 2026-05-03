import ExcelJS from "exceljs";
import { conversion } from "@/utils";

// ==============================>
// ## Export Booking to Excel
// ==============================>
export interface ExportBookingParams {
  bookings    :  any[];
  dateStart  ?:  string;
  dateEnd    ?:  string;
}

export const exportBookingToExcel = async ({ bookings, dateStart, dateEnd }: ExportBookingParams) => {
  const workbook  =  new ExcelJS.Workbook();
  const sheet     =  workbook.addWorksheet("Pesanan");

  // ── Header info ────────────────────────────────
  sheet.mergeCells("A1:N1");
  sheet.getCell("A1").value       =  "Daftar Pesanan";
  sheet.getCell("A1").font        =  { bold: true, size: 14 };
  sheet.getCell("A1").alignment   =  { horizontal: "center" };

  if (dateStart && dateEnd) {
    sheet.mergeCells("A2:N2");
    sheet.getCell("A2").value       =  `Periode: ${dateStart} s/d ${dateEnd}`;
    sheet.getCell("A2").alignment   =  { horizontal: "center" };
    sheet.getCell("A2").font        =  { italic: true, color: { argb: "FF666666" } };
  }

  sheet.addRow([]);

  // ── Column definitions ─────────────────────────
  sheet.columns = [
    { key: "number",           width: 14 },
    { key: "customer_name",    width: 22 },
    { key: "customer_contact", width: 18 },
    { key: "customer_address", width: 28 },
    { key: "customer_mother_name",  width: 18 },
    { key: "customer_father_name",  width: 18 },
    { key: "customer_phone",        width: 18 },
    { key: "customer_email",        width: 22 },
    { key: "customer_social_media", width: 18 },
    { key: "unit",             width: 22 },
    { key: "start_at",         width: 22 },
    { key: "end_at",           width: 22 },
    { key: "total",            width: 18 },
    { key: "total_paid",       width: 18 },
    { key: "status",           width: 16 },
  ];

  // ── Table header row ───────────────────────────
  const headerRow = sheet.addRow([
    "Nomor", "Nama Pemesan", "Kontak", "Alamat",
    "Nama Ibu", "Nama Ayah", "No HP", "Email", "IG/FB",
    "Unit", "Tanggal Mulai", "Tanggal Selesai",
    "Total Tagihan", "Total Bayar", "Status"
  ]);

  headerRow.eachCell((cell) => {
    cell.font            =  { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill            =  { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
    cell.alignment       =  { horizontal: "center" };
    cell.border          =  { bottom: { style: "thin", color: { argb: "FFDDDDDD" } } };
  });

  const statusLabel: Record<string, string> = {
    DRAFT: "DIBUAT", ORDERED: "DIPESAN", RENTED: "DISEWA",
    RETURNED: "DIKEMBALIKAN", DONE: "SELESAI", CANCELED: "DIBATALKAN",
  };

  // ── Data rows ──────────────────────────────────
  bookings.forEach((b) => {
    const row = sheet.addRow([
      b.number || "-",
      b.customer_name || "-",
      b.customer_contact || "-",
      b.customer_address || "-",
      b.customer_mother_name || "-",
      b.customer_father_name || "-",
      b.customer_phone || "-",
      b.customer_email || "-",
      b.customer_social_media || "-",
      b.unit?.unit_category?.name ? `${b.unit.unit_category.name} (${b.unit.code})` : "-",
      b.start_at ? conversion.date(b.start_at, "DD-MM-YYYY HH:mm") : "-",
      b.end_at ? conversion.date(b.end_at, "DD-MM-YYYY HH:mm") : "-",
      b.total || 0,
      b.total_paid || 0,
      statusLabel[b.status] || b.status || "-",
    ]);

    // Amount cells — number format
    const totalCell       =  row.getCell(13);
    const totalPaidCell   =  row.getCell(14);
    totalCell.numFmt      =  '"Rp "#,##0';
    totalPaidCell.numFmt  =  '"Rp "#,##0';
  });

  // ── Download ───────────────────────────────────
  const buffer  =  await workbook.xlsx.writeBuffer();
  const blob    =  new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url     =  URL.createObjectURL(blob);
  const anchor  =  document.createElement("a");

  anchor.href     =  url;
  anchor.download =  `pesanan${dateStart ? `_${dateStart}` : ""}${dateEnd ? `_${dateEnd}` : ""}.xlsx`;
  anchor.click();

  URL.revokeObjectURL(url);
};
