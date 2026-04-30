"use client"

import { useEffect, useState } from "react";
import { api, cn, conversion } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt } from "@fortawesome/free-solid-svg-icons";

type UnitCategoryItem = {
  id           :  number;
  code         :  string;
  name         :  string;
  color        :  string;
  price        :  number | string;
  hourly_price :  number | string;
  status       :  string; // 'AVAILABLE' | 'UNAVAILABLE'
};

type UnitListSelectorProps = {
  value        ?:  number | string;
  invalid      ?:  string;
  onChange     ?:  (value: number | string, price: number) => void;
  register     ?:  (name: string, validations?: any) => void;
  availableAt  ?:  string;
};

export function CustomerUnitListSelectorComponent({
  value,
  invalid,
  onChange,
  register,
  availableAt,
}: UnitListSelectorProps) {
  const [categories, setCategories] = useState<UnitCategoryItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<number | string | undefined>(value);

  // Register for validation
  useEffect(() => {
    register?.("unit_category_id", ["required"]);
  }, []);

  // Sync external value
  useEffect(() => {
    setSelected(value);
  }, [value]);

  // Fetch unit categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const params: any = {};
      if (availableAt) {
        params.available_at = availableAt;
      }
      const res = await api({
        path: "customer-booking-units",
        params,
      });
      if (res?.status === 200) {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setCategories(data);
      }
      setLoading(false);
    };
    fetchCategories();
  }, [availableAt]);

  // const filtered = categories.filter((c) => {
  //   const keyword = search.toLowerCase();
  //   return (
  //     (c.name || "").toLowerCase().includes(keyword) ||
  //     (c.code || "").toLowerCase().includes(keyword)
  //   );
  // });

  const handleSelect = (cat: UnitCategoryItem) => {
    if (cat.status !== "AVAILABLE") return;
    setSelected(cat.id);
    onChange?.(cat.id, Number(cat.price || 0));
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="font-bold uppercase tracking-wider text-black">
        PILIH IPHONE
      </label>

      {/* <div className="relative">
        <InputBookingComponent 
          leftIcon={faSearch}
          placeholder="Cari iphone..."
          value={search}
          onChange={(e) => setSearch(e)}
          className="py-2"
        />
      </div> */}

      <div className="grid gap-2">
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
          : categories.length === 0
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
              Tidak ada kategori unit ditemukan
            </div>
          )
          : categories.map((cat) => {
              const isAvailable = cat.status === "AVAILABLE";
              const isSelected  = selected == cat.id;

              return (
                <button
                  type="button"
                  key={cat.id}
                  disabled={!isAvailable}
                  onClick={() => handleSelect(cat)}
                  className={cn(
                    "px-4 py-4 border-2 border-b-4 border-r-4 !border-black bg-white transition-all duration-100 ease-in-out text-left",
                    isSelected && isAvailable && "bg-[#ff2d78]",
                    isAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 border-2 border-b-4 border-r-4 !border-black text-white text-xl flex items-center justify-center rotate-4"
                      style={{
                        background: cat?.color || "#7b9cff",
                      }}
                    >
                      <FontAwesomeIcon icon={faMobileAlt} />
                    </div>
                    <div className="flex-grow">
                      <p className={`font-extrabold uppercase ${isSelected && isAvailable ? "text-white" : "text-black"}`}>
                        {cat.name || cat.code || "Unknown"}
                      </p>
                      <p className={`text-sm ${isSelected && isAvailable ? "text-white/80" : "text-[#ff2d78]"}`}>
                        {conversion.currency(Number(cat.price || 0))} / Hari
                      </p>
                    </div>
                    {!isAvailable && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-white"
                      >
                        HABIS
                      </span>
                    )}
                  </div>
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
