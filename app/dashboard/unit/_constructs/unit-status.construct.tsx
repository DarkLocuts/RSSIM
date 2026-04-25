import { cn } from "@utils"

const color = {
  AVAILABLE    :  "bg-light-success text-success",
  UNAVAILABLE  :  "bg-light-warning text-warning",
}

const label = {
  AVAILABLE    :  "TERSEDIA",
  UNAVAILABLE  :  "TIDAK TERSEDIA",
}


export function UnitStatusComponent({status}: {status: "AVAILABLE" | "UNAVAILABLE"}) {
  return (
    <>
      <div className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest w-max", color[status])}>{label[status]}</div>
    </>
  )
}
