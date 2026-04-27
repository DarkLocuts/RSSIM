import { ButtonComponent } from '@/components'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { PresenceClockComponent } from '../../presence/_constructs/PresenceClock.component'
import { useAuthContext } from '@/contexts'
import { api } from '@/utils'
import { useState, useEffect } from 'react'

export function AttendanceComponent() {
  const {user}  =  useAuthContext()
  const [presenceData, setPresenceData]  =  useState<any>(null)
  const [loading, setLoading]            =  useState(true)

  const fetchPresence = async () => {
    setLoading(true)
    const res = await api({ path: "presences", method: "GET", params: { filter: [{column: "user_id", type: "eq", value: user?.id}, {column: "date", type: "eq", value: new Date().toISOString().split("T")[0]}]} })
    if (res?.status === 200) setPresenceData(res.data?.data?.at(0) || null)
    setLoading(false)
  }

  useEffect(() => {
      if(user?.id) fetchPresence()
    }, [user])

  return (
    <>
        <div className="bg-white rounded-xl border p-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-light-primary flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-primary text-sm" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider">Kehadiran</p>
          </div>

          <div className="text-right">
            {!presenceData?.check_in && !presenceData?.check_out ? (
              <PresenceClockComponent />
            ) : (
              <p className="text-xs font-bold uppercase tracking-wider bg-green-200 text-success px-3 py-1 rounded-full">Selesai</p>
            )}
          </div>
        </div>

        {!loading && !presenceData?.check_out && (
          <div className="mt-4">
            <Link href="/dashboard/presence">
            {!presenceData?.check_in ? (
              <ButtonComponent
                label="MASUK"
                className="py-3 rounded-xl text-sm font-bold cursor-pointer text-white"
                block
                disabled={loading}
              />
            ) : (
              <ButtonComponent
                label="PULANG"
                className="py-3 rounded-xl text-sm font-bold cursor-pointer text-white"
                block
                disabled={loading}
              />
            )}
            </Link>
          </div>
        )}
      </div>
    
    </>
  )
}
