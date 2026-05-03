import { useMemo } from "react";
import { useGetApi } from "@utils";

// ==============================>
// ## Report Chart Service
// ==============================>
export const useReportChartService = (months: number = 6) => {
  const includeParams = useMemo(() => ({
    months: months.toString(),
  }), [months]);

  const { data: responseBody, loading } = useGetApi({
    path: "reports/chart",
    includeParams,
  });

  const financialData  =  responseBody?.data?.financial_chart || [];
  const unitTrendData  =  responseBody?.data?.unit_trend_chart || [];

  return { financialData, unitTrendData, loading };
};
