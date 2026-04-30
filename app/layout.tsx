import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import { Inter } from "next/font/google";
import "@styles/globals.css";

import moment from "moment";
import "moment/locale/id";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { ContextAppProvider } from "@contexts/AppProvider";
import { ShortcutProvider } from "@components";


export const viewport: Viewport = {
  themeColor          :  "#FAFDFF",
  width               :  "device-width",
  initialScale        :  1,
  maximumScale        :  1,
  userScalable        :  false,
};

export const metadata: Metadata = {
  title               :  "RSSIM",
  description         :  "Rental System Sewa IPhone Madiun",
  applicationName     :  "RSSIM",
  appleWebApp         :  {
    capable            :  true,
    statusBarStyle     :  "default",
    title              :  "RSSIM",
  },
  icons               :  {
    icon               :  "/logo.png",
    apple              :  "/logo.png",
  },
};

moment.locale("id");
config.autoAddCss = false;


const font = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});


export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={font.className}>
      <body className="antialiased">
        <ContextAppProvider>
          <ShortcutProvider />
            {children}
        </ContextAppProvider>
      </body>
    </html>
  );
}