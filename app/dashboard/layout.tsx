"use client";

import { ReactNode } from "react";
import { BottombarComponent, SidebarComponent, SidebarContentComponent } from "@/components";
import { usePathname } from "next/navigation";
import { faBoxesStacked, faBuilding, faCalendarCheck, faCalendarDay, faCreditCard, faFileLines, faHome, faMobileScreen, faPen, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function RentalLayout({ children }: { children: ReactNode }) {
  const pathname       =  usePathname();
  const hideBottombar  =  pathname !== "/dashboard/booking" && pathname.startsWith("/dashboard/booking");

  return (
    <>
      

      <div className="flex">
        <SidebarComponent
          basePath="/dashboard"
          head={
            <div className="px-2 flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-12 h-10 bg-white rounded-2xl border !border-primary group hover:scale-110 transition-transform duration-300">
                <span className="font-black italic text-primary group-hover:text-secondary transition-colors">SIM</span>
              </div>
              <h1 className="font-black text-primary tracking-tight">RENTAL SYSTEM</h1>
            </div>
          }
          items={[
            {
              label: "Dashboard",
              items: [
                {
                  leftContent: <FontAwesomeIcon icon={faHome} className="mr-2" />,
                  label: "Dashboard",
                  path: "/",
                },
              ],
            },
            {
              label: "Pesanan",
              items: [
                {
                  leftContent: <FontAwesomeIcon icon={faFileLines} className="mr-2" />,
                  label: "Pesanan",
                  path: "/booking",
                },
                {
                  leftContent: <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />,
                  label: "Kalender",
                  path: "/calendar",
                },
              ]
            },
            {
              label: "Menajemen",
              items: [
                {
                  leftContent: <FontAwesomeIcon icon={faMobileScreen} className="mr-2" />,
                  label: "Unit",
                  path: "/unit",
                },
                {
                  leftContent: <FontAwesomeIcon icon={faBoxesStacked} className="mr-2" />,
                  label: "Jenis Unit",
                  path: "/category",
                },
                {
                  leftContent: <FontAwesomeIcon icon={faBuilding} className="mr-2" />,
                  label: "Cabang",
                  path: "/outlet",
                },
                {
                  leftContent: <FontAwesomeIcon icon={faCreditCard} className="mr-2" />,
                  label: "Metode Pembayaran",
                  path: "/payment-method",
                },
                {
                  leftContent: <FontAwesomeIcon icon={faUsers} className="mr-2" />,
                  label: "Akun / Karyawan",
                  path: "/user",
                },
                {
                  leftContent: <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />,
                  label: "Kehadiran Karyawan",
                  path: "/presence/list",
                },
              ]
            },
            {
              label: "Laporan",
              items: [
                {
                  leftContent: <FontAwesomeIcon icon={faPen} className="mr-2" />,
                  label: "Catat Transaksi",
                  path: "/transaction",
                },
                {
                  leftContent: <FontAwesomeIcon icon={faCalendarDay} className="mr-2" />,
                  label: "Laporan",
                  path: "/report",
                },
              ]
            },
          ]}
        />
        <SidebarContentComponent>
          <div className="p-0 lg:p-4">
            <div className="mx-auto relative min-h-screen pb-20">
              {children}
            </div>
          </div>
        </SidebarContentComponent>
      </div>

      {!hideBottombar && <div className="block md:hidden"><BottombarComponent /></div>}
    </>
  );
}
