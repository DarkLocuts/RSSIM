import { cn, conversion } from "@utils"

const color = {
  AVAILABLE    :  "bg-green-100 text-success",
  UNAVAILABLE  :  "bg-amber-100 text-warning",
}

const label = {
  AVAILABLE    :  "TERSEDIA",
  UNAVAILABLE  :  "DISEWA",
}


export function UnitStatusComponent({status, outlet, available_at}: {status: "AVAILABLE" | "UNAVAILABLE", outlet?: string, available_at?: string}) {
  return (
    <>
      <div className={cn("px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest w-max", color[status])}>
        {label[status]}{" "}
        {(status == "AVAILABLE" && outlet) && `(${outlet})`} {available_at && status !== "AVAILABLE" && `(${conversion.date(available_at, "DD/MM/YYYY")})`}
      </div>
    </>
  )
}
