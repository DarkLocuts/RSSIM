"use client"

import Link from "next/link";
import { RentalStatusChipComponent } from "@/components/construct.components/rental";
import { AttendanceComponent, DashboardComponent } from "@app";

const recentOrders = [
  { unit: "iPhone 15 Pro Max",  customer: "Andi Wijaya",   duration: "3 Hari",  price: "Rp 1.200.000",  status: "berjalan" as const },
  { unit: "iPhone 14 Plus",     customer: "Siti Rahma",    duration: "1 Hari",  price: "Rp 450.000",    status: "berjalan" as const },
  { unit: "iPhone 13 Mini",     customer: "Budi Santoso",  duration: "2 Hari",  price: "Rp 700.000",    status: "terpesan" as const },
  { unit: "iPhone 15 Pro",      customer: "Diana Putri",   duration: "5 Hari",  price: "Rp 2.000.000",  status: "tersedia" as const },
];

export default function HomePage() {
  return (
    <div className="px-2 pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#203044] -mt-0.5">
            Selamat Datang, Joko Gunawan
          </h1>
        </div>
      </div>

      <AttendanceComponent />

      <DashboardComponent />


      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="text-base font-bold">Pesanan Terbaru</h2>
        <Link href="/dashboard/pesanan" className="text-xs font-semibold text-primary">
          Lihat Semua
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {recentOrders.map((order, i) => (
          <Link href={`/dashboard/pesanan/${i + 1}`} key={i}>
            <div className="bg-white rounded-xl p-3 border flex items-center gap-4">
              
              <div className="flex justify-between w-full">
                <div>
                  <h3 className="text-sm font-bold truncate">{order.unit}</h3>
                  <p className="text-xs mt-0.5">
                    {order.customer} • {order.duration}
                  </p>
                  <p className="text-sm font-bold text-primary mt-1">{order.price}</p>
                </div>
                <div>
                  <RentalStatusChipComponent variant={order.status} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
