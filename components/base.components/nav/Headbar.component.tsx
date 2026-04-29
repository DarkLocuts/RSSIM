"use client"

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";



export interface HeadbarProps {
  title         ?:  string;
  noBtnBack     ?:  boolean;
  rightContent  ?:  ReactNode;
};




export function HeadbarComponent({ title, noBtnBack, rightContent }: HeadbarProps) {
  const router  =  useRouter();

  return (
    <div className="flex justify-between w-full items-center mt-4 mb-4">
      <div className="flex items-center">
        {!noBtnBack && (
          <div className="w-8 aspect-square flex justify-center items-center md:hidden" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faChevronLeft} className="text-slate-400 text-xl" />
          </div>
        )}
        <p className="text-lg font-bold px-2">{title}</p>
      </div> 
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
}
