"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@utils";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = auth.getAccessToken();
      
      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-6 relative overflow-hidden">
      <div className="z-10 text-center animate-pulse">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 text-primary">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 opacity-50">
          Rental System <span className="text-primary italic">SIM</span>
        </h1>
      </div>
    </main>
  );
}
