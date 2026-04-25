"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFileLines, faCalendarDays, faUser, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@utils";



const navItems = [
  { label: "Beranda",  icon: faHome,         path: "/dashboard" },
  { label: "Pesanan",  icon: faFileLines,     path: "/dashboard/pesanan" },
  { label: "Kalender", icon: faCalendarDays,  path: "/dashboard/kalender" },
  { label: "Unit", icon: faMobileScreen,  path: "/dashboard/unit" },
  { label: "Akun",     icon: faUser,          path: "/dashboard/akun" },
];



export function RentalBottomNavComponent() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <div
        className="mx-3 rounded-[1.5rem] px-2 py-1"
        style={{
          backgroundColor: "rgba(244, 246, 255, 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0px 10px 30px rgba(32, 48, 68, 0.05)",
        }}
      >
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center py-3 rounded-[1.25rem] gap-1 cursor-pointer",
                    active
                      ? "text-[#0050d4]"
                      : "text-[#68788f]"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full",
                      active && "bg-[#dce9ff]"
                    )}
                  >
                    <FontAwesomeIcon icon={item.icon} className="text-base" />
                  </div>
                  <span
                    className={cn(
                      "text-[0.6875rem] leading-none",
                      active ? "font-semibold" : "font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
