import { ReactNode } from "react";
import { BottombarComponent } from "@/components";


export default function RentalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-[430px] relative min-h-screen pb-28">
        {children}
      </div>

      <BottombarComponent />
    </>
  );
}
