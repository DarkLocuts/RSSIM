import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMobileAlt, faReceipt, faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { conversion } from "@/utils";

// Memphis status badge styling
const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  DRAFT     :  { label: "DRAFT",                bg: "#e5e5e5",  color: "#1a1a1a" },
  ORDERED   :  { label: "MENUNGGU PEMBAYARAN",   bg: "#fbbf24",  color: "#1a1a1a" },
  RENTED    :  { label: "SEDANG DISEWA",         bg: "#7dd3fc",  color: "#1a1a1a" },
  RETURNED  :  { label: "SELESAI",               bg: "#86efac",  color: "#1a1a1a" },
  CANCELED  :  { label: "DIBATALKAN",            bg: "#fca5a5",  color: "#1a1a1a" },
};

export function BookingDetailComponent({ booking }: { booking: any }) {
  const status = booking.status || "DRAFT";
  const statusInfo = statusConfig[status] || statusConfig.DRAFT;

  // Calculate duration
  const startDate = booking.start_at ? new Date(booking.start_at) : null;
  const endDate = booking.end_at ? new Date(booking.end_at) : null;
  let durationDays = 0;
  if (startDate && endDate) {
    durationDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  }

  const sisaTagihan = Number(booking?.total || 0) - Number(booking?.total_paid || 0);

  return (
    <div>
      {/* Title Block */}
      <div className="text-center mb-5">
        <h2
          style={{
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#1a1a1a",
            fontSize: "22px",
            lineHeight: "1.2",
          }}
        >
          DETAIL
          <br />
          PESANAN
        </h2>
      </div>

      {/* ID Pesanan */}
      <div className="mb-3">
        <p
          style={{
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "10px",
            color: "#888",
            marginBottom: "4px",
          }}
        >
          ID PESANAN
        </p>
        <div
          className="inline-block"
          style={{
            border: "2.5px solid #1a1a1a",
            padding: "6px 14px",
            fontWeight: 900,
            fontSize: "16px",
            color: "#1a1a1a",
            letterSpacing: "0.05em",
          }}
        >
          #{booking.code || "-"}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <div
          className="inline-block"
          style={{
            background: statusInfo.bg,
            color: statusInfo.color,
            fontWeight: 900,
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: "5px 12px",
            border: "2px solid #1a1a1a",
          }}
        >
          {statusInfo.label}
        </div>
      </div>

      {/* Nama Pemesan */}
      <div
        className="mb-3"
        style={{
          border: "2.5px solid #1a1a1a",
          padding: "14px",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: "28px",
              height: "28px",
              color: "#ff2d78",
              fontSize: "14px",
            }}
          >
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div>
            <p
              style={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "10px",
                color: "#888",
                marginBottom: "2px",
              }}
            >
              NAMA PEMESAN
            </p>
            <p
              style={{
                fontWeight: 900,
                fontSize: "16px",
                color: "#1a1a1a",
              }}
            >
              {booking.customer_name || "-"}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#666",
                marginTop: "2px",
              }}
            >
              {booking.customer_contact || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Unit Sewa */}
      <div
        className="mb-3"
        style={{
          border: "2.5px solid #1a1a1a",
          padding: "14px",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: "40px",
              height: "40px",
              background: booking?.unit?.unit_category?.color || "#7b9cff",
              border: "2px solid #1a1a1a",
              color: "#fff",
              fontSize: "16px",
            }}
          >
            <FontAwesomeIcon icon={faMobileAlt} />
          </div>
          <div>
            <p
              style={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "10px",
                color: "#888",
                marginBottom: "2px",
              }}
            >
              UNIT SEWA
            </p>
            <p
              style={{
                fontWeight: 900,
                fontSize: "15px",
                color: "#1a1a1a",
              }}
            >
              {booking.unit?.unit_category?.name || "-"}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "1px",
              }}
            >
              {booking.unit?.label || ""} {booking.unit?.code ? `· ${booking.unit.code}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Jadwal Sewa */}
      <div
        className="mb-3"
        style={{
          border: "2.5px solid #1a1a1a",
          overflow: "hidden",
        }}
      >
        {/* Cyan header */}
        <div
          style={{
            background: "#7dd3fc",
            padding: "8px 14px",
            borderBottom: "2.5px solid #1a1a1a",
          }}
        >
          <p
            style={{
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontSize: "12px",
              color: "#1a1a1a",
            }}
          >
            JADWAL SEWA
          </p>
        </div>

        {/* Mulai */}
        <div
          className="flex items-center gap-3"
          style={{
            padding: "12px 14px",
            borderBottom: "2px solid #1a1a1a",
          }}
        >
          <FontAwesomeIcon
            icon={faArrowDown}
            style={{ color: "#22c55e", fontSize: "14px" }}
          />
          <div>
            <p
              style={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "9px",
                color: "#888",
              }}
            >
              MULAI
            </p>
            <p
              style={{
                fontWeight: 900,
                fontSize: "14px",
                color: "#1a1a1a",
              }}
            >
              {conversion.date(booking.start_at, "DD MMMM YYYY HH:mm") || "-"}
            </p>
          </div>
        </div>

        {/* Selesai */}
        <div
          className="flex items-center gap-3"
          style={{
            padding: "12px 14px",
            borderBottom: "2px solid #1a1a1a",
          }}
        >
          <FontAwesomeIcon
            icon={faArrowUp}
            style={{ color: "#ef4444", fontSize: "14px" }}
          />
          <div>
            <p
              style={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: "9px",
                color: "#888",
              }}
            >
              SELESAI
            </p>
            <p
              style={{
                fontWeight: 900,
                fontSize: "14px",
                color: "#1a1a1a",
              }}
            >
              {conversion.date(booking.end_at, "DD MMMM YYYY HH:mm") || "-"}
            </p>
          </div>
        </div>

        {/* Duration badge */}
        {durationDays > 0 && (
          <div style={{ padding: "10px 14px" }}>
            <div
              className="inline-block"
              style={{
                background: "#ff2d78",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "4px 12px",
                border: "2px solid #1a1a1a",
              }}
            >
              {durationDays} HARI
            </div>
          </div>
        )}
      </div>

      {/* Rincian Biaya */}
      <div
        className="mb-3"
        style={{
          border: "2.5px solid #1a1a1a",
          overflow: "hidden",
        }}
      >
        {/* Cyan header */}
        <div
          className="flex items-center gap-2"
          style={{
            background: "#7dd3fc",
            padding: "8px 14px",
            borderBottom: "2.5px solid #1a1a1a",
          }}
        >
          <FontAwesomeIcon icon={faReceipt} style={{ fontSize: "12px", color: "#1a1a1a" }} />
          <p
            style={{
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontSize: "12px",
              color: "#1a1a1a",
            }}
          >
            RINCIAN BIAYA
          </p>
        </div>

        <div style={{ padding: "14px" }}>
          {/* Harga Sewa */}
          <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", color: "#555" }}>Harga Sewa</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a" }}>
              {conversion.currency(booking?.total_price || 0)}
            </span>
          </div>

          {/* Biaya Layanan */}
          <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", color: "#555" }}>Biaya Layanan</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a" }}>
              {conversion.currency(booking?.total_charge || 0)}
            </span>
          </div>

          {/* Dashed separator */}
          <div
            style={{
              borderTop: "2px dashed #c4c4c4",
              paddingTop: "12px",
              marginBottom: "8px",
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ fontSize: "14px", fontWeight: 900, color: "#1a1a1a" }}>
                Total Tagihan
              </span>
              <span style={{ fontSize: "14px", fontWeight: 900, color: "#1a1a1a" }}>
                {conversion.currency(booking?.total || 0)}
              </span>
            </div>
          </div>

          {/* Total Dibayar */}
          {Number(booking?.total_paid || 0) > 0 && (
            <div className="flex items-center justify-between" style={{ marginTop: "8px" }}>
              <span style={{ fontSize: "13px", color: "#555" }}>Total Dibayar</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#22c55e" }}>
                {conversion.currency(booking?.total_paid || 0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Sisa Tagihan Badge */}
      <div
        className="flex items-center justify-between"
        style={{
          background: "#ff2d78",
          border: "2.5px solid #1a1a1a",
          padding: "14px 16px",
        }}
      >
        <span
          style={{
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontSize: "12px",
            color: "#ffffff",
          }}
        >
          SISA
          <br />
          TAGIHAN
        </span>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontWeight: 900,
              fontSize: "13px",
              color: "#ffffff",
              display: "block",
            }}
          >
            Rp
          </span>
          <span
            style={{
              fontWeight: 900,
              fontSize: "22px",
              color: "#ffffff",
              lineHeight: "1",
            }}
          >
            {new Intl.NumberFormat("id-ID").format(sisaTagihan)}
          </span>
        </div>
      </div>
    </div>
  );
}
