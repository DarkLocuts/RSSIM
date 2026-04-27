"use client"

import { AttendanceComponent, DashboardComponent } from "@app";
import { RecentBookingListComponent } from "./_structures/RecentBookingList.component";

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


      <RecentBookingListComponent />
    </div>
  );
}
