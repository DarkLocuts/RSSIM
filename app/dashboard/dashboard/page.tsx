"use client"

import { AttendanceComponent, DashboardComponent } from "@app";
import { RecentBookingListComponent } from "./_structures/RecentBookingList.component";

export default function HomePage() {
  return (
    <div className="px-2 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold"> Selamat Datang, Joko Gunawan</h1>
      </div>

      <AttendanceComponent />

      <DashboardComponent />

      <RecentBookingListComponent />
    </div>
  );
}
