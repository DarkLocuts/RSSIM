"use client"

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@utils";



export interface RentalBackHeaderProps {
  title         :  string;
  rightContent  ?:  ReactNode;
  className     ?:  string;
  onBack        ?:  () => void;
}



export function RentalBackHeaderComponent({
  title,
  rightContent,
  className,
  onBack,
}: RentalBackHeaderProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-1 py-4 sticky top-0 z-30",
        className,
      )}
      style={{ backgroundColor: "#f4f6ff" }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBack || (() => router.back())}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#dce9ff] text-[#203044]"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="text-lg font-bold text-[#203044]">{title}</h1>
      </div>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
}
