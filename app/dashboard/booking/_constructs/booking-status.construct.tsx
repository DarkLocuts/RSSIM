import { cn } from "@utils"

const color: Record<string, string> = {
  DRAFT     :  "bg-slate-100 text-slate-600",
  ORDERED   :  "bg-cyan-100 text-cyan-600",
  RENTED    :  "bg-blue-100 text-primary",
  RETURNED  :  "bg-violet-100 text-violet-600",
  DONE      :  "bg-green-100 text-success",
  CANCELED  :  "bg-red-100 text-danger",
}

const label: Record<string, string> = {
  DRAFT     :  "DIBUAT",
  ORDERED   :  "DIPESAN",
  RENTED    :  "DISEWA",
  RETURNED  :  "DIKEMBALIKAN",
  DONE      :  "SELESAI",
  CANCELED  :  "DIBATALKAN",
}

export function BookingStatusComponent({status, size = "md"}: {status: string, size?: "xs" | "md"}) {
  return (
    <>
      <div className={cn("font-bold uppercase tracking-widest w-max", color[status] || "bg-slate-100 text-slate-600", size === "xs" ? "text-[10px] px-1.5 py-0.5 rounded-md" : "text-xs px-3 py-1 rounded-lg")}>{label[status] || status}</div>
    </>
  )
}
