import { ButtonComponent } from '@/components'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { PresenceClockComponent } from '../../presence/_constructs/PresenceClock.component'

export function AttendanceComponent() {
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
            <PresenceClockComponent />
          </div>
        </div>

        <div className="mt-4">
          <Link href="/dashboard/presence">
            <ButtonComponent
              label="MASUK"
              className="py-3 rounded-xl text-sm font-bold cursor-pointer text-white"
              block
            />
          </Link>
        </div>
      </div>
    
    </>
  )
}
