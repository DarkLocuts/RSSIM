"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGear, faFileLines, faMobileScreen, faCalendarDay } from "@fortawesome/free-solid-svg-icons";

import { cn, pcn, useKeyboardOpen } from "@utils";



export interface BottombarProps {
  active     ?:  string;
  className  ?:  string;
}



export function BottombarComponent({ className = "", active }: BottombarProps) {
  const pathname        =  usePathname();
  const isKeyboardOpen  =  useKeyboardOpen();

  const styles = {
    base: cn(
      "fixed w-full left-0 z-50 flex justify-around items-center py-3 px-3 bg-white/80 backdrop-blur-xl rounded-t-[24px] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] transition-all duration-300",
      isKeyboardOpen ? "-bottom-60" : "bottom-0",
      pcn(className, "base")
    ),
    item: "flex items-center justify-center w-10 aspect-square transition-colors rounded-lg",
    itemActive: "bg-blue-50 text-primary",
    itemInactive: "text-slate-400 hover:text-primary"
  };

  const navItems = [
    { name: "home", href: "/dashboard", icon: faHome },
    { name: "history", href: "/dashboard/booking", icon: faFileLines },
    { name: "calendar", href: "/dashboard/calendar", icon: faCalendarDay },
    { name: "unit", href: "/dashboard/unit", icon: faMobileScreen },
    { name: "setting", href: "/dashboard/setting", icon: faGear },
  ];

  return (
    <nav className={styles.base}>
      {navItems.map((item) => {
        const isActive = (item.name !== 'home' && pathname.startsWith(item.href)) || active === item.name || (pathname === '/dashboard' && item.name === 'home');

        return (
          <Link href={item.href} key={item.name} className={cn(styles.item, isActive ? styles.itemActive : styles.itemInactive, pcn(className, "item"), isActive && pcn(className, "active"))}>
            <FontAwesomeIcon icon={item.icon} className="text-2xl" />
          </Link>
        );
      })}
    </nav>
  );
}
