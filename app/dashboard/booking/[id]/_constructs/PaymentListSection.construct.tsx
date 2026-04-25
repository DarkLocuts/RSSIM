"use client"

import { cn } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faExclamationTriangle,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";


const typeConfig: Record<string, { label: string; icon: any; bg: string; text: string; iconBg: string; iconColor: string }> = {
  payment: {
    label: "Pembayaran",
    icon: faMoneyBillWave,
    bg: "bg-green-50",
    text: "text-green-700",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  penalty: {
    label: "Denda",
    icon: faExclamationTriangle,
    bg: "bg-red-50",
    text: "text-red-700",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
};


export function PaymentListSectionComponent({ payments }: { payments: any[] }) {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
          Riwayat Pembayaran
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faReceipt} className="text-xl text-gray-400" />
          </div>
          <p className="text-sm text-on-surface-variant font-medium">Belum ada pembayaran</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Gunakan tombol di bawah untuk menambahkan pembayaran atau denda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
        Riwayat Pembayaran ({payments.length})
      </h3>

      <div className="flex flex-col gap-3">
        {payments.map((payment: any, index: number) => {
          const config = typeConfig[payment.type] || typeConfig.payment;
          const amount = Number(payment.amount || 0);

          return (
            <div
              key={payment.id || index}
              className="border rounded-lg px-4 py-3 flex items-center gap-3 transition-colors"
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", config.iconBg)}>
                <FontAwesomeIcon icon={config.icon} className={cn("text-sm", config.iconColor)} />
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", config.bg, config.text)}>
                    {config.label}
                  </span>
                  {payment.payment_method?.name && (
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {payment.payment_method.name}
                    </span>
                  )}
                </div>
                {payment.note && (
                  <p className="text-xs text-on-surface-variant mt-1 truncate">{payment.note}</p>
                )}
                {payment.created_at && (
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    {new Date(payment.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0 text-right">
                <p className={cn(
                  "text-sm font-bold",
                  payment.type === "penalty" ? "text-red-600" : "text-green-600"
                )}>
                  {payment.type === "penalty" ? "+" : ""}Rp {amount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
