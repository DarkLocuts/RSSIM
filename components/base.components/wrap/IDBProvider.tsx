"use client"

import { idb } from "@utils"
import { AppSchema } from "@schema"

idb.setDefaultSchema(AppSchema)

export default function IDBProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
