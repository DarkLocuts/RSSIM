import { cn } from "@utils";


export type RentalStatusVariant = "berjalan" | "tersedia" | "terpesan" | "selesai" | "dibatalkan";


const variantStyles: Record<RentalStatusVariant, string> = {
  berjalan:    "bg-[#d8e2ff] text-[#001e5a]",
  tersedia:    "bg-[#69f6b8] text-[#005a3c]",
  terpesan:    "bg-[#f8a010] text-[#4a2c00]",
  selesai:     "bg-[#c9deff] text-[#4d5d73]",
  dibatalkan:  "bg-[#fb5151]/15 text-[#b31b25]",
};

const variantLabels: Record<RentalStatusVariant, string> = {
  berjalan:    "Berjalan",
  tersedia:    "Tersedia",
  terpesan:    "Terpesan",
  selesai:     "Selesai",
  dibatalkan:  "Dibatalkan",
};



export function RentalStatusChipComponent({
  variant,
  label,
  className,
}: {
  variant     :  RentalStatusVariant;
  label       ?:  string;
  className   ?:  string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
        variantStyles[variant],
        className,
      )}
    >
      {label || variantLabels[variant]}
    </span>
  );
}
