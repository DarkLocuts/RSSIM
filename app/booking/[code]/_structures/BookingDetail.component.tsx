import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMobileAlt, faReceipt, faArrowDown, faArrowUp, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { conversion } from "@utils";

export function BookingDetailComponent({ booking }: { booking: any }) {
  const startDate     =  booking.start_at ? new Date(booking.start_at) : null;
  const endDate       =  booking.end_at ? new Date(booking.end_at) : null;
  let   durationDays  =  0;

  if (startDate && endDate) {
    durationDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  }

  const sisaTagihan = Number(booking?.total || 0) - Number(booking?.total_paid || 0);

  return (
    <div>
      <div className="bg-[#7dd3fc] px-4 py-3 border-2 border-b-0 border-r-4 !border-black">
        <div className="flex gap-4">
          <FontAwesomeIcon icon={faUser} className="text-black text-sm" />
          <p className="uppercase text-xs font-extrabold text-black tracking-widest">
            Pemesan
          </p>
        </div>
      </div>
      <div className="mb-3 p-4 border-2 border-b-4 border-r-4 !border-black">
        <div className="grid grid-cols-4 gap-2">
          <div className="text-sm">Nama</div>
          <div className="col-span-3 text-sm">
            : <span className="text-[#ff2d78] font-semibold">{booking.customer_name || "-"}</span>
          </div>
          <div className="text-sm">Kontak</div>
          <div className="col-span-3 text-sm">
            : <span className="font-semibold">{booking.customer_contact || "-"}</span>
          </div>
        </div>
      </div>


      <div className="bg-[#7dd3fc] px-4 py-3 border-2 border-b-0 border-r-4 !border-black">
        <div className="flex gap-4">
          <FontAwesomeIcon icon={faMobileAlt} className="text-black text-sm" />
          <p className="uppercase text-xs font-extrabold text-black tracking-widest">
            IPHONE DISEWA
          </p>
        </div>
      </div>
      <div className="mb-3 p-4 border-2 border-b-4 border-r-4 !border-black">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 border-2 border-b-4 border-r-4 !border-black text-white text-xl flex items-center justify-center rotate-4"
            style={{
              background: booking?.unit?.unit_category?.color || "#7b9cff",
            }}
          >
            <FontAwesomeIcon icon={faMobileAlt} />
          </div>
          <div>
            <p className="text-[#ff2d78] font-semibold text-sm uppercase">{booking.unit?.unit_category?.name || "-"}</p>
            <p className="text-xs mt-1">{booking.unit?.code || "-"}</p>
          </div>
        </div>
      </div>


      <div className="bg-[#7dd3fc] px-4 py-3 border-2 border-b-0 border-r-4 !border-black">
        <div className="flex gap-4">
          <FontAwesomeIcon icon={faCalendar} className="text-black text-sm" />
          <p className="uppercase text-xs font-extrabold text-black tracking-widest">
            JADWAL SEWA
          </p>
        </div>
      </div>
      <div className="p-4 border-2 border-b-0 border-r-4 !border-black">
        <div className="flex items-center gap-4">
          <FontAwesomeIcon
            icon={faArrowDown}
            className="text-green-500"
          />
          <div>
            <p className="font-bold uppercase tracking-wider text-[10px]">
              MULAI
            </p>
            <p className="font-extrabold text-black text-sm tracking-widest">
              {conversion.date(booking.start_at, "DD MMMM YYYY") || "-"}
            </p>
          </div>
        </div>
      </div>
      <div className="mb-3 p-4 border-2 border-b-4 border-r-4 !border-black relative">
        <div className="absolute -top-3 right-2 border-2 border-b-4 border-r-4 px-2 py-0.5 !border-black -rotate-5 bg-[#ff2d78] text-white font-bold text-xs uppercase tracking-widest z-30">{durationDays} HARI</div>
        <div className="flex items-center gap-4">
          <FontAwesomeIcon
            icon={faArrowUp}
            className="text-red-500"
          />
          <div>
            <p className="font-bold uppercase tracking-wider text-[10px]">
              SELESAI
            </p>
            <p className="font-extrabold text-black text-sm tracking-widest">
              {conversion.date(booking.end_at, "DD MMMM YYYY") || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#7dd3fc] px-4 py-3 border-2 border-b-0 border-r-4 !border-black">
        <div className="flex gap-4">
          <FontAwesomeIcon icon={faReceipt} className="text-black text-sm" />
          <p className="uppercase text-xs font-extrabold text-black tracking-widest">
            RINCIAN BIAYA
          </p>
        </div>
      </div>
      <div className="mb-6 p-4 border-2 border-b-4 border-r-4 !border-black relative">
        <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
          <span className="text-sm">Biaya Sewa</span>
          <span className="text-sm text-black font-bold">
            {conversion.currency(booking?.total_price || 0)}
          </span>
        </div>
        <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
          <span className="text-sm">Charge</span>
          <span className="text-sm text-black font-bold">
            {conversion.currency(booking?.total_charge || 0)}
          </span>
        </div>
        <div className="border border-t-2 border-dashed mb-2 mt-3"></div>
        <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
          <span className="text-sm">Total Tagihan</span>
          <span className="text-sm text-black font-bold">
            {conversion.currency(booking?.total || 0)}
          </span>
        </div>

        <div className="w-[95%] absolute -bottom-6 right-2 rotate-3 border-2 border-b-4 border-r-4 px-2 py-0.5 !border-black bg-[#7dd3fc] text-white font-bold text-xs uppercase tracking-widest z-30">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-black">Terbayar</span>
            <span className="text-lg text-black font-bold">
              {conversion.currency(booking?.total_paid || 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#ff2d78] px-4 py-3 border-2 border-b-4 border-r-4 !border-black rotate-1">
        <div className="flex items-center justify-between">
          <p className="uppercase font-bold text-white tracking-wider">
            SISA TAGIHAN
          </p>
          <p className="text-xl font-extrabold text-white">{conversion.currency(sisaTagihan)}</p>
        </div>
      </div>
    </div>
  );
}
