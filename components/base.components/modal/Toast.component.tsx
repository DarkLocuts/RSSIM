"use client"

import { ReactNode, useEffect, useState, useRef } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { cn, pcn } from "@utils";
import { IconButtonComponent } from "@components";



type CT = "base" | "backdrop" | "header" | "footer";

export interface ToastProps {
  show       :  boolean;
  onClose    :  () => void;
  title     ?:  string | ReactNode;
  children  ?:  any;
  footer    ?:  string | ReactNode;
  paint     ?:  "primary" | "secondary" | "success" | "danger" | "warning";

  /** Use custom class with: "backdrop::", "header::", "footer::". */
  className?: string;
};

const toastPaint = {
  primary    :  "!border-primary bg-light-primary",
  secondary  :  "!border-secondary bg-light-secondary",
  success    :  "!border-success bg-light-success",
  danger     :  "!border-danger bg-light-danger",
  warning    :  "!border-warning bg-light-warning",
};


export function ToastComponent({
  show,
  onClose,
  title,
  footer,
  className = "",
  paint = "success",
}: ToastProps) {
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef(5);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (show) {
      countdownRef.current = 5;
      setCountdown(5); 
      clearTimer();
      
      timerRef.current = setInterval(() => {
        countdownRef.current -= 1;
        if (countdownRef.current <= 0) {
          clearTimer();
          setCountdown(0);
          onCloseRef.current();
        } else {
          setCountdown(countdownRef.current);
        }
      }, 1000);
    } else {
      clearTimer();
    }
    
    return () => clearTimer();
  }, [show]);

  const handleMouseEnter = () => {
    clearTimer();
  };

  const handleMouseLeave = () => {
    if (!show) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        clearTimer();
        setCountdown(0);
        onCloseRef.current();
      } else {
        setCountdown(countdownRef.current);
      }
    }, 1000);
  };

  return (
    <>
      <div
        className={cn(
          "toast border-t-4 rounded-b-xl md:rounded-xl transition-all duration-300",
          "w-full md:w-[calc(100vw-2rem)] md:max-w-[300px] md:h-max",
          toastPaint[paint],
          !show && "max-md:-translate-y-[150%] max-md:opacity-0 md:translate-y-full opacity-0 md:scale-y-0",
          pcn<CT>(className, "base"),
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {title && (
          <div
            className={cn(
              "py-2 px-3 flex justify-between items-center text-foreground",
              pcn<CT>(className, "header"),
            )}
          >
            <h6 className={`font-semibold text-sm text-${paint}`}>{title}</h6>

            <div className="flex gap-2 items-center">
              <span className="text-xs text-foreground/50">{countdown}</span>
              <IconButtonComponent
                icon={faTimes}
                variant="simple"
                paint="danger"
                onClick={() => {
                  clearTimer();
                  onClose();
                }}
                size="sm"
              />
            </div>
          </div>
        )}

        {footer && (
          <div className={cn("modal-footer", pcn<CT>(className, "footer"))}>
            {show && footer}
          </div>
        )}
      </div>
    </>
  );
}
