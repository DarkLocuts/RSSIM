"use client"

import { Suspense, useState } from "react";
import { HeadbarComponent, InputCheckboxComponent, InputComponent, TableSupervisionComponent } from "@components";
import { UnitStatusComponent } from "@app";
import UnitCategoryCardComponent from "../category/_constructs/UnitCategoryCard.component";
import { useAuthContext } from "@/contexts";
import { useResponsive } from "@/utils";
import moment from "moment";

export default function ProductPage() {
  const { user } = useAuthContext();

  const [dateStart, setDateStart] = useState(moment().format("YYYY-MM-DD"));
  const [dateEnd, setDateEnd] = useState(moment().format("YYYY-MM-DD"));
  const [filterCategory, setFilterCategory] = useState<any[]>([]);
  const [filterOutlet, setFilterOutlet] = useState<any[]>([]);

  return (
    <Suspense>
      <div className="px-2">
        <HeadbarComponent title="Unit" noBtnBack />

        <TableSupervisionComponent
          fetchControl={{
            path: "units",
            params: { 
              expand: ["unit_category", "outlet"],
              filter: [
                ...(filterCategory?.length > 0 ? [{ column: "unit_category_id", type: "in", value: filterCategory }] : []),
                ...(filterOutlet?.length > 0 ? [{ column: "outlet_id", type: "in", value: filterOutlet }] : [])
              ] as any[]
            },
            includeParams: {
              ...(dateStart && dateEnd ? { available_at: `${dateStart}|${dateEnd}` } : {})
            }
          }}
          columnControl={[
            {
              selector: "code",
              label: "Kode",
              sortable: true
            },
            {
              selector: "unit_category_id",
              label: "Jenis Unit",
              item: (r) => r.unit_category?.name || "-",
            },
          ]}
          formControl={{
            fields: [
              {
                type: "select",
                construction: {
                  name                 :  "unit_category_id",
                  label                :  "Jenis Unit",
                  placeholder          :  "Pilih jenis unit",
                  serverOptionControl  :  {path: "unit-categories", params: {selectableOption: ["id", "name"]}},
                  validations          :  ["required"]
                }
              },
              ...(user?.role_id == 1 ? [{
                type: "select",
                construction: {
                  name                 :  "outlet_id",
                  label                :  "Outlet",
                  placeholder          :  "Pilih outlet",
                  serverOptionControl  :  {path: "outlets", params: {selectableOption: ["id", "name"]}},
                  validations          :  ["required"]
                }
              }] as any[] : []),
              {
                construction: {
                  name: "description",
                  label: "Deskripsi",
                  placeholder: "Deskripsi unit",
                }
              }
            ]
          }}
          controlBar={["CREATE", "SEARCH", <FilterUnit key="filter-unit" dateStart={dateStart} dateEnd={dateEnd} setDateStart={setDateStart} setDateEnd={setDateEnd} setFilterCategory={setFilterCategory} setFilterOutlet={setFilterOutlet} />]}
          detailControl={false}
          block
          responsiveControl={{
            mobile: {
              item: (row) => {
                return (
                  <div className="border bg-white rounded-lg w-full">
                    <div className="w-full flex justify-between items-center px-4 py-2 border-b ">
                      <div className="text-sm font-semibold">#{row.code}</div>
                      <UnitStatusComponent status={row.status || "UNAVAILABLE"} outlet={row.outlet?.name} available_at={row.available_at} />
                    </div>
                    <div className="px-4 py-4">
                      <UnitCategoryCardComponent data={row.unit_category} />
                    </div>
                  </div>
                );
              },
            }
          }}
        />
      </div>
    </Suspense>
  );
}



const FilterUnit = ({ dateStart, dateEnd, setDateStart, setDateEnd, setFilterCategory, setFilterOutlet }: any) => {
  const { isSm } = useResponsive();
  const { user } = useAuthContext();

  if(isSm) {
    return (
      <>
        <div className="px-2 pb-20 w-full">
          <p className="text-sm mb-2">Ketersediaan Unit</p>
          <div className="flex flex-col gap-2 p-2 border rounded-lg">
            <InputComponent
              type="date"
              label={"Dari"}
              name="_start_date"
              value={dateStart}
              onChange={(v) => setDateStart(v)}
              placeholder="YYYY-MM-DD"
              className="md:py-1.5 md:text-sm"
            />
            <InputComponent
              type="date"
              label={"Sampai"}
              name="_end_date"
              value={dateEnd}
              onChange={(v) => setDateEnd(v)}
              placeholder="YYYY-MM-DD"
              className="md:py-1.5 md:text-sm"
            />
          </div>

          <InputCheckboxComponent
            label="Jenis Unit"
            name="_filter_category"
            serverOptionControl={{ path: "unit-categories", params: {selectableOption: ["id", "name"]} }}
            vertical
            onChange={(v) => setFilterCategory(v)}
            className="max-h-[300px] label::mt-4"
          />

          {user?.role_id == 1 && (
            <InputCheckboxComponent
              label="Outlet"
              name="_filter_outlet"
              serverOptionControl={{ path: "outlets", params: {selectableOption: ["id", "name"]} }}
              vertical
              onChange={(v) => setFilterOutlet(v)}
              className="max-h-[300px] label::mt-4"
            />
          )}
        </div>
      </>
    ) 
  } else {
    return <></>;
  }
}