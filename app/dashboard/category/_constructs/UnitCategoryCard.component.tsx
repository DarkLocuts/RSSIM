import { conversion } from '@/utils'
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function UnitCategoryCardComponent({ data }: {data: Record<string, any> | null}) {
  if(!data) return <span className="text-sm text-on-surface-variant">-</span>

  return (
    <div className="w-full flex items-center gap-2">
        <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
        style={{ backgroundColor: data.color || "#7b9cff" }}
        >
        <FontAwesomeIcon icon={faMobileAlt} className="text-lg" />
        </div>
        <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center">
            <h4 className="text-on-surface font-bold text-base truncate">{data.name || "Unknown"}</h4>
            <span className="text-[10px] font-semibold text-primary bg-cyan-50 px-2 py-1 rounded-md uppercase tracking-wider">
            {data.code || "-"}
            </span>
        </div>
        <p className="text-xs text-on-surface-variant mt-0.5">
            {data.price ? conversion.currency(data.price) : "-"} / hari | {data.hourly_price ? conversion.currency(data.hourly_price) : "-"} / jam
        </p>
        </div>
    </div>
  )
}
