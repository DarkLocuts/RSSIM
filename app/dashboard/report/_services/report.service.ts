import { useMemo } from "react";
import { useGetApi } from "@utils";

// ==============================>
// ## Report Service
// ==============================>
export const useReportService = (dateFrom: string, dateTo: string, outletId?: string, paymentMethod?: string) => {
  // Memoize to avoid new object reference on every render (prevents infinite loop)
  const includeParams = useMemo(() => ({
    start_at        :  dateFrom,
    end_at          :  dateTo,
    ...(outletId        ? { outlet_id: outletId } : {}),
    ...(paymentMethod   ? { payment_method: paymentMethod } : {}),
  }), [dateFrom, dateTo, outletId, paymentMethod]);

  const { data: responseBody, loading, reset } = useGetApi({
    path: "reports",
    includeParams,
  });

  const summary      =  responseBody?.data?.summary      || null;
  const transactions =  responseBody?.data?.transactions || [];

  return { summary, transactions, loading, reset };
};
