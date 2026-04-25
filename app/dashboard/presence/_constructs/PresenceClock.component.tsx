"use client"

import { conversion } from "@/utils"
import { useEffect, useState } from "react"


export function PresenceClockComponent() {
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  useEffect(() =>
  {
    const updateClock = () =>
    {
      const now = new Date()

      setCurrentTime(conversion.date(now.toISOString(), "HH:mm:ss"))

      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      )
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col">
      <div className="gap-2 text-xs text-light-foreground">
        <span className="font-medium">{currentDate || "---"}</span>
      </div>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{currentTime || "--:--:--"}</h2>
      </div>
    </div>
  )
}
