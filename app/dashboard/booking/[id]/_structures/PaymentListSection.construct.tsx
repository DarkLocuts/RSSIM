"use client"

import { cn, conversion } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faMoneyBillWave, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { ButtonComponent } from "@/components";


// const typeConfig: Record<string, { label: string; icon: any; bg: string; text: string; iconBg: string; iconColor: string }> = {
//   payment: {
//     label: "Pembayaran",
//     icon: faMoneyBillWave,
//     bg: "bg-green-50",
//     text: "text-green-700",
//     iconBg: "bg-green-100",
//     iconColor: "text-green-600",
//   },
//   penalty: {
//     label: "Denda",
//     icon: faExclamationTriangle,
//     bg: "bg-red-50",
//     text: "text-red-700",
//     iconBg: "bg-red-100",
//     iconColor: "text-red-600",
//   },
// };


export function PaymentListSectionComponent({ booking, payments, onAddCharge, onAddPayment }: { booking: any, payments: any[], onAddCharge: () => void, onAddPayment: () => void }) {
  // if (!payments || payments.length === 0) {
  //   return (
  //     <div className="bg-white rounded-xl border p-4">
  //       <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">
  //         Riwayat Pembayaran
  //       </h3>
  //       <div className="flex flex-col items-center justify-center py-8 text-center">
  //         <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
  //           <FontAwesomeIcon icon={faReceipt} className="text-xl text-gray-400" />
  //         </div>
  //         <p className="text-sm text-on-surface-variant font-medium">Belum ada pembayaran</p>
  //         <p className="text-xs text-on-surface-variant mt-1">
  //           Gunakan tombol di bawah untuk menambahkan pembayaran atau denda.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="border-b py-4 px-4">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
          Ringkasan Pembayaran
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Harga Sewa</span>
            <span className="text-sm font-bold text-on-surface">
              {conversion.currency(booking?.total_price || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Charge</span>
            <span className="text-sm font-bold text-on-surface">
              {conversion.currency(booking?.total_charge || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed pt-2">
            <span className="text-sm text-on-surface-variant">Total Tagihan</span>
            <span className="text-sm font-bold text-on-surface">
              {conversion.currency(booking?.total || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Total Dibayar</span>
            <span className="text-sm font-bold text-green-600">
              {conversion.currency(booking?.total_paid || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed pt-2">
            <span className="text-sm font-semibold text-on-surface">Sisa Tagihan</span>
            <span className="text-sm font-bold text-danger">
              {conversion.currency(Number(booking?.total || 0) - Number(booking?.total_paid || 0))}
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mt-4 px-4">
        Riwayat Pembayaran ({!payments ? 0 : payments.length})
      </h3>

      <div className="flex flex-col gap-2">
        {!payments || payments.length < 1 ? <>
          <div className="flex flex-col items-center justify-center py-8 px-8 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <FontAwesomeIcon icon={faReceipt} className="text-xl text-gray-400" />
            </div>
            <p className="text-sm text-on-surface-variant font-medium">Belum ada pembayaran</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Gunakan tombol di bawah untuk menambahkan pembayaran atau charge.
            </p>
          </div>
        </> : payments.map((payment: any, index: number) => {
          return (
            <div
              key={payment.id || index}
              className="border rounded-lg px-4 py-3 flex items-center gap-3 transition-colors"
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100")}>
                <FontAwesomeIcon icon={faMoneyBillWave} className={cn("text-sm text-success")} />
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full")}>
                    {payment?.user?.name || ""}
                  </span>
                  {payment.payment_method?.name && (
                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {payment.payment_method.name}
                    </span>
                  )}
                </div>
                {payment.note && (
                  <span className="text-[10px] text-light-foreground line-clamp-1">
                    {payment.note}
                  </span>
                )}
                {payment.created_at && (
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{conversion.date(payment.created_at, "DD-MM-YYYY HH:mm:mm")}</p>
                )}
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-sm text-primary font-bold">
                  {conversion.currency(payment.amount || 0)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 px-4 gap-2 py-4 border-t">
        <ButtonComponent
          size="sm"
          className="w-full py-3"
          label="Charge"
          variant="outline"
          paint="danger"
          icon={faExclamationTriangle}
          onClick={onAddCharge}
          block
          rounded
        />
        <ButtonComponent
          size="sm"
          className="w-full py-3"
          label="Bayar"
          icon={faMoneyBillWave}
          onClick={onAddPayment}
          block
          rounded
        />
      </div>
    </div>
  );
}
