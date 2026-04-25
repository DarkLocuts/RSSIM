"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faCreditCard, faWallet } from "@fortawesome/free-solid-svg-icons";
import { HeadbarComponent } from "@/components";


const summary = {
  totalRevenue  :  "Rp 24.500.000",
  income        :  "Rp 28.000.000",
  expense       :  "Rp 3.500.000",
};

const transactions = [
  { id: 1,  label: "Sewa iPhone 15 Pro",    customer: "Andi Wijaya",    amount: "+Rp 1.500.000",  type: "income" as const,   method: "Tunai",     date: "23 Okt, 14:30",  icon: faMoneyBill },
  { id: 2,  label: "Pemeliharaan Unit",      customer: "Biaya Internal", amount: "-Rp 250.000",    type: "expense" as const,  method: "Transfer",  date: "22 Okt, 10:00",  icon: faWallet },
  { id: 3,  label: "Sewa iPhone 14 Plus",    customer: "Siti Aminah",    amount: "+Rp 1.200.000",  type: "income" as const,   method: "BCA",       date: "21 Okt, 09:15",  icon: faCreditCard },
  { id: 4,  label: "Perbaikan Layar",        customer: "Biaya Internal", amount: "-Rp 500.000",    type: "expense" as const,  method: "Tunai",     date: "20 Okt, 16:45",  icon: faWallet },
  { id: 5,  label: "Sewa iPhone 13",         customer: "Budi Santoso",   amount: "+Rp 900.000",    type: "income" as const,   method: "Mandiri",   date: "20 Okt, 08:30",  icon: faCreditCard },
  { id: 6,  label: "Sewa iPhone 15 Pro Max", customer: "Diana Putri",    amount: "+Rp 2.000.000",  type: "income" as const,   method: "BCA",       date: "19 Okt, 13:20",  icon: faCreditCard },
];


export default function ReportPage() {
  return (
    <div className="px-2">
      <HeadbarComponent title="Laporan Keuangan" />


      <div className="rounded-2xl p-4 mb-8 bg-white border">
        <p className="text-xs font-medium text-foreground mb-1">Ringkasan Pendapatan</p>
        <h2 className="text-3xl font-bold text-primary mb-5">{summary.totalRevenue}</h2>

        <div className="flex gap-3">
          <div className="flex-1 rounded-xl px-4 py-2 border">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs text-foreground font-semibold">Pemasukan</p>
            </div>
            <p className="text-sm font-bold text-secondary">{summary.income}</p>
          </div>
          <div className="flex-1 rounded-xl px-4 py-2 border">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-xs text-foreground font-semibold">Pengeluaran</p>
            </div>
            <p className="text-sm font-bold text-danger">{summary.expense}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Daftar Transaksi</p>

        <div className="flex flex-col gap-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-xl border p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type === "income" ? "bg-blue-50 text-primary" : "bg-red-50 text-danger"}`}>
                <FontAwesomeIcon icon={tx.icon} className="text-sm" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate">{tx.label}</h4>
                <p className="text-xs text-light-foreground mt-0.5">
                  {tx.customer} • {tx.method}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${tx.type === "income" ? "text-primary" : "text-danger"}`}>
                  {tx.amount}
                </p>
                <p className="text-xs text-light-foreground mt-0.5">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
