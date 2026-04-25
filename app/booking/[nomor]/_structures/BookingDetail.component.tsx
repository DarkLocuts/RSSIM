import { cn } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCalendarAlt, faUser, faPhone, faMobileAlt, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";

export function BookingDetailComponent({ booking }: { booking: any }) {
  const isPaid = Number(booking.total_paid || 0) >= Number(booking.total_bill || 0);

  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
      <div className="bg-primary/10 p-6 flex flex-col items-center justify-center text-center border-b border-primary/20">
        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-4">
          <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-on-surface">Pesanan Diterima</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Terima kasih, pesanan Anda telah kami terima dan sedang dalam proses.
        </p>
        <div className="mt-4 inline-block bg-white px-3 py-1 rounded-md text-sm font-semibold border shadow-sm">
          #{booking.number}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        {/* Customer Info */}
        <div>
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Informasi Pemesan
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Nama Pemesan</p>
                <p className="font-semibold text-on-surface">{booking.customer_name || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Kontak</p>
                <p className="font-semibold text-on-surface">{booking.customer_contact || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Info */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Unit Disewa
          </h3>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
              <FontAwesomeIcon icon={faMobileAlt} />
            </div>
            <div>
              <p className="font-semibold text-on-surface">{booking.unit?.label || booking.unit?.code || "-"}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {booking.unit?.unit_category?.name || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Jadwal Sewa
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Tanggal Mulai</p>
                <p className="font-semibold text-on-surface">{booking.start_date || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Tanggal Selesai</p>
                <p className="font-semibold text-on-surface">{booking.end_date || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 p-6">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">
            Pembayaran
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-on-surface-variant">Total Tagihan</span>
            <span className="font-bold">Rp {Number(booking.total_bill || 0).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-on-surface-variant">Total Dibayar</span>
            <span className="font-bold text-green-600">Rp {Number(booking.total_paid || 0).toLocaleString("id-ID")}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-500" />
            </div>
            <div className="flex-grow">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full", isPaid ? "bg-green-500" : "bg-primary")} 
                  style={{ width: `${Math.min(100, (Number(booking.total_paid || 0) / Math.max(1, Number(booking.total_bill || 1))) * 100)}%` }}
                />
              </div>
            </div>
            <span className={cn("text-xs font-bold", isPaid ? "text-green-600" : "text-primary")}>
              {isPaid ? "LUNAS" : "BELUM LUNAS"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
