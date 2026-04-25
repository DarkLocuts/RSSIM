import { DashboardCardComponent } from '@/components'
import { faClipboard, faClipboardCheck, faClipboardList, faMobileAlt, faMobilePhone } from "@fortawesome/free-solid-svg-icons";

export function DashboardComponent() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <DashboardCardComponent 
          title="Semua Unit"
          value={"48"}
          icon={faMobilePhone}
          iconBgColor='bg-blue-50'
          iconColor='text-blue-500'
        />

        <DashboardCardComponent 
          title="Unit Tersedia"
          value={"28"}
          icon={faMobileAlt}
          iconBgColor='bg-green-50'
          iconColor='text-green-500'
        />
      </div>

      <DashboardCardComponent
        title="Pesanan Aktif"
        value={"28"}
        icon={faClipboardList}
      />

      <div className="grid grid-cols-2 gap-2 mb-4 mt-2">
        <DashboardCardComponent 
          title="Dipesan"
          value={"28"}
          icon={faClipboard}
          iconBgColor='bg-amber-50'
          iconColor='text-warning'
        />
        <DashboardCardComponent 
          title="Berjalan"
          value={"28"}
          icon={faClipboardCheck}
          iconBgColor='bg-green-50'
          iconColor='text-green-500'
        />
      </div>
    </>
  )
}
