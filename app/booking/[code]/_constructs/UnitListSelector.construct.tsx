"use client"

import { useEffect, useState } from "react";
import { api, cn, conversion } from "@utils";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputBookingComponent } from "./InputBooking.component";

type UnitItem = {
  id: number;
  label: string;
  code: string;
  status: string;
  unit_category?: { label?: string; name?: string; color?: string, price?: string };
};

type UnitListSelectorProps = {
  value?: number | string;
  invalid?: string;
  onChange?: (value: number | string, price: number) => void;
  register?: (name: string, validations?: any) => void;
};

export function CustomerUnitListSelectorComponent({
  value,
  invalid,
  onChange,
  register,
}: UnitListSelectorProps) {
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | string | undefined>(value);

  // Register for validation
  useEffect(() => {
    register?.("unit_id", ["required"]);
  }, []);

  // Sync external value
  useEffect(() => {
    setSelected(value);
  }, [value]);

  // Fetch units from API
  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      const res = await api({
        path: "customer-booking-units",
        params: { expand: ["unit_category"] },
      });
      if (res?.status === 200) {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setUnits(data);
      }
      setLoading(false);
    };
    fetchUnits();
  }, []);

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
    
    onChange?.(newValue, Number(unit.unit_category?.price || 0));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="font-bold uppercase tracking-wider text-black">
        PILIH IPHONE
      </label>

      <div className="relative">
        <InputBookingComponent 
          leftIcon={faSearch}
          placeholder="Cari iphone..."
          value={search}
          onChange={(e) => setSearch(e)}
          className="py-2"
        />
      </div>

      <div className="grid gap-2 max-h-[320px] overflow-y-auto scroll-memphis pr-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  border: "2.5px solid #e5e5e5",
                  padding: "14px 10px",
                  textAlign: "center",
                  height: "56px",
                }}
              />
            ))
          : filtered.length === 0
          ? (
            <div
              className="col-span-2 text-center"
              style={{
                padding: "24px",
                fontSize: "12px",
                color: "#888",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
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
                    "px-4 py-4 border-2 border-b-4 border-r-4 !border-black bg-white transition-all duration-100 ease-in-out", 
                    isSelected && isAvailable && "border-2 !border-[#ff2d78] bg-[#ff2d78]",
                    isAvailable ? "cursor-pointer" : "cursor-not-allowed",
                    isAvailable ? "opacity-100" : "opacity-40"
                  )}
                >
                  <p className="font-extrabold text-black text-left uppercase">
                    {cat?.name || unit.label || "Unknown"}
                  </p>
                  {unit.code && (
                    <p className={`text-left text-[#ff2d78] ${isSelected && isAvailable && "text-black"}`}>
                      {conversion.currency(Number(cat?.price || 0))} / Hari
                    </p>
                  )}
                </button>
              );
            })}
      </div>

      {/* Validation Error */}
      {invalid && (
        <small
          style={{
            fontSize: "11px",
            color: "#ff2d78",
            fontWeight: 700,
          }}
        >
          {invalid}
        </small>
      )}
    </div>
  );
}
