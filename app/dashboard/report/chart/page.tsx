"use client"

import { useState } from "react";
import { HeadbarComponent } from "@/components";
import { FinancialChartComponent } from "../_structures/FinancialChart.component";
import { UnitTrendChartComponent } from "../_structures/UnitTrendChart.component";
import { useReportChartService } from "../_services/report-chart.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faExpand } from "@fortawesome/free-solid-svg-icons";

export default function ReportChartPage() {
  const [months, setMonths] = useState(5);
  const { financialData, unitTrendData, loading } = useReportChartService(months);

  // Extract categories from unit trend data
  const unitCategories = unitTrendData?.categories || [];

  return (
    <div className="px-2">
      <HeadbarComponent 
        title="Statistik & Tren" 
        rightContent={
          <button 
            onClick={() => setMonths(months === 5 ? 12 : 5)}
            className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            <FontAwesomeIcon icon={months === 5 ? faExpand : faFilter} className="text-primary text-xs" />
            <span className="text-xs font-bold text-on-surface">
              {months === 5 ? "Lihat 1 Tahun" : "Lihat 5 Bulan"}
            </span>
          </button>
        }
      />

      <div className="flex flex-col gap-6 mt-2 mb-6">
        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-64 bg-gray-100 rounded-xl border border-gray-200" />
            <div className="h-64 bg-gray-100 rounded-xl border border-gray-200" />
          </div>
        ) : (
          <>
            {financialData?.length > 0 && (
              <FinancialChartComponent 
                data={financialData} 
                title="Arus Kas Bulanan"
                subtitle={`Data keuangan ${months} bulan terakhir`}
              />
            )}
            {unitTrendData?.data?.length > 0 && (
              <UnitTrendChartComponent 
                data={unitTrendData.data} 
                categories={unitCategories} 
                title="Tren Unit Terlaris"
                subtitle={`Frekuensi penyewaan unit ${months} bulan terakhir`}
              />
            )}
          </>
        )}

        {!loading && financialData?.length === 0 && unitTrendData?.data?.length === 0 && (
          <div className="bg-white border rounded-xl p-12 text-center">
            <p className="text-sm font-medium text-light-foreground">Belum ada data statistik tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
