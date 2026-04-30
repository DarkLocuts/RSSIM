"use client"

import { useAuthContext } from "@/contexts";
import { AttendanceComponent } from "./_structures/Attendance.component";
import { DashboardComponent } from "./_structures/Dashboard.component";
import { RecentBookingListComponent } from "./_structures/RecentBookingList.component";

export default function HomePage() {
  const { user } = useAuthContext()

  return (
    <div className="px-2 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold"> Selamat Datang, {user?.name}</h1>
      </div>

      <AttendanceComponent /> 

      <DashboardComponent />

      <RecentBookingListComponent />
    </div>
  );
}
