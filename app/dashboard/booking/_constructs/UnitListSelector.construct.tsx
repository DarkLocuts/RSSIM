"use client"

import { useEffect, useState } from "react";
import { api, cn } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faSearch } from "@fortawesome/free-solid-svg-icons";

type UnitItem = {
  id              :  number;
  label           :  string;
  code            :  string;
  status          :  string;
  description     :  string;
  unit_category  ?:  { label?: string; name?: string; color?: string };
};

type UnitListSelectorProps = {
  value        ?:  number | string;
  invalid      ?:  string;
  onChange     ?:  (value: number | string) => void;
  register     ?:  (name: string, validations?: any) => void;
  availableAt  ?:  string;
};

export function UnitListSelectorComponent({
  value,
  invalid,
  onChange,
  register,
  availableAt,
}: UnitListSelectorProps) {
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | string | undefined>(value);

  useEffect(() => {
    register?.("unit_id", ["required"]);
  }, []);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      const params: any = { expand: ["unit_category"] };
      if (availableAt) {
        params.available_at = availableAt;
      }

      const res = await api({
        path: "units",
        params: {
          ...params,
          paginate: 9999,
        },
      });
      if (res?.status === 200) {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setUnits(data);
      }
      setLoading(false);
    };
    fetchUnits();
  }, [availableAt]);

  const filtered = units.filter((u) => {
    const keyword = search.toLowerCase();
    const label = (u.label || "").toLowerCase();
    const code = (u.code || "").toLowerCase();
    const catName = (u.unit_category?.name || "").toLowerCase();
    return label.includes(keyword) || code.includes(keyword) || catName.includes(keyword);
  });

  const handleSelect = (unit: UnitItem) => {
    if (unit.status !== "AVAILABLE") return;
    const newValue = unit.id;
    setSelected(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="input-label">
        Unit<span className="text-danger">*</span>
      </label>

      <div className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm"
        />
        <input
          type="text"
          placeholder="Cari unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto input-scroll pr-1">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border bg-white rounded-lg px-4 py-3 flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))
          : filtered.length === 0
          ? (
            <div className="text-center text-sm text-on-surface-variant py-6">
              Tidak ada unit ditemukan
            </div>
          )
          : filtered.map((unit) => {
              const isAvailable = unit.status === "AVAILABLE";
              const isSelected = selected == unit.id;
              const cat = unit.unit_category;

              return (
                <button
                  type="button"
                  key={unit.id}
                  disabled={!isAvailable}
                  onClick={() => handleSelect(unit)}
                  className={cn(
                    "border bg-white rounded-lg px-4 py-3 flex items-center gap-3 transition-all w-full text-left relative",
                    isAvailable ? "cursor-pointer hover:border-primary/50" : "opacity-50 cursor-not-allowed",
                    isSelected && isAvailable && "border-primary ring-1 ring-primary/30 bg-primary/5"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSelected && isAvailable
                          ? "border-primary"
                          : "border-gray-300",
                        !isAvailable && "border-gray-200"
                      )}
                    >
                      {isSelected && isAvailable && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>

                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                    style={{ backgroundColor: cat?.color || "#7b9cff" }}
                  >
                    <FontAwesomeIcon icon={faMobileAlt} className="text-lg" />
                  </div>

                  <div className="w-full">
                    <div className="flex justify-between items-center w-full">
                      <h4 className="text-on-surface font-bold text-base truncate">
                        {unit.unit_category?.name || "-"}
                      </h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">
                        {unit.code || "-"}
                      </p>
                    </div>
                    <div className="text-xs">{unit?.description || "-"}</div>
                  </div>
                </button>
              );
            })}
      </div>

      {invalid && (
        <small className="input-error-message">{invalid}</small>
      )}
    </div>
  );
}
