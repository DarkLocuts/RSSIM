"use client";

import { ReactNode } from "react";
import { BottombarComponent } from "@/components";
import { usePathname } from "next/navigation";


export default function RentalLayout({ children }: { children: ReactNode }) {
  const pathname       =  usePathname();
  const hideBottombar  =  pathname !== "/dashboard/booking" && pathname.startsWith("/dashboard/booking");

  return (
    <>
      <div className="mx-auto max-w-[430px] relative min-h-screen pb-28">
        {children}
      </div>

      {!hideBottombar && <BottombarComponent />}
    </>
  );
}
