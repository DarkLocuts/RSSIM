"use client";

import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "./Auth.context";
import { api } from "@/utils";

interface PresenceGuardContextInterface {
  hasCheckedIn: boolean | null;
  loadingPresence: boolean;
  checkPresence: () => Promise<void>;
}

const PresenceGuardContext = createContext<PresenceGuardContextInterface | undefined>(undefined);

export const PresenceGuardContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthContext();
  const [hasCheckedIn, setHasCheckedIn] = useState<boolean | null>(null);
  const [loadingPresence, setLoadingPresence] = useState(false);

  const checkPresence = async () => {
    if (!user || user.role_id == 1) {
      setHasCheckedIn(true);
      return;
    }

    setLoadingPresence(true);
    const today = new Date().toISOString().split("T")[0];
    const res = await api({ 
      path: "presences", 
      method: "GET", 
      params: { filter: [{column: "user_id", type: "eq", value: user.id}, {column: "date", type: "eq", value: today}]} 
    });
    
    const presenceData = res?.data?.data?.at(0);
    const checkedIn = !!presenceData?.check_in;
    
    setHasCheckedIn(checkedIn);
    setLoadingPresence(false);

    if (!checkedIn && pathname.startsWith("/dashboard") && pathname !== "/dashboard/presence") {
      router.replace("/dashboard/presence");
    }
  };

  useEffect(() => {
    if (user && pathname.startsWith("/dashboard")) {
      checkPresence();
    }
  }, [user, pathname]);

  // Don't render dashboard content if not checked in and not on presence page
  const isDashboard = pathname.startsWith("/dashboard");
  const isPresencePage = pathname === "/dashboard/presence";
  
  if (isDashboard && !isPresencePage && user && user.role_id != 1) {
    if (loadingPresence || hasCheckedIn === null) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-light-foreground">Memeriksa kehadiran...</p>
          </div>
        </div>
      );
    }
    
    if (hasCheckedIn === false) {
      // Prevent rendering the restricted page while redirecting
      return null; 
    }
  }

  return (
    <PresenceGuardContext.Provider value={{ hasCheckedIn, loadingPresence, checkPresence }}>
      {children}
    </PresenceGuardContext.Provider>
  );
};

export const usePresenceGuardContext = (): PresenceGuardContextInterface => {
  const context = useContext(PresenceGuardContext);
  if (!context) {
    throw new Error("usePresenceGuardContext must be used within a PresenceGuardContextProvider");
  }
  return context;
};
