"use client"

import { useEffect, useState } from "react";
import { api } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type UnitItem = {
  id: number;
  label: string;
  code: string;
  status: string;
  category?: { label?: string; name?: string; color?: string };
  unit_category?: { label?: string; name?: string; color?: string };
};

type UnitListSelectorProps = {
  value?: number | string;
  invalid?: string;
  onChange?: (value: number | string) => void;
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

  // Filter units by search
  const filtered = units.filter((u) => {
    const keyword = search.toLowerCase();
    const label = (u.label || "").toLowerCase();
    const code = (u.code || "").toLowerCase();
    const catName = (u.unit_category?.name || u.category?.name || "").toLowerCase();
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
      {/* Memphis Label */}
      <label
        style={{
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontSize: "11px",
          color: "#1a1a1a",
        }}
      >
        PILIH UNIT<span style={{ color: "#ff2d78" }}>*</span>
      </label>

      {/* Search - Memphis style */}
      <div className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#888", fontSize: "12px" }}
        />
        <input
          type="text"
          placeholder="Cari unit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 14px 10px 34px",
            border: "2.5px solid #1a1a1a",
            borderRadius: "0px",
            fontSize: "13px",
            outline: "none",
            background: "#ffffff",
          }}
        />
      </div>

      {/* Unit Grid - Memphis 2-column */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "1fr 1fr",
          maxHeight: "320px",
          overflowY: "auto",
        }}
      >
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
              const cat = unit.unit_category || unit.category;

              return (
                <button
                  type="button"
                  key={unit.id}
                  disabled={!isAvailable}
                  onClick={() => handleSelect(unit)}
                  style={{
                    border: isSelected && isAvailable
                      ? "2.5px solid #ff2d78"
                      : "2.5px solid #1a1a1a",
                    borderRadius: "0px",
                    padding: "12px 8px",
                    textAlign: "center",
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    opacity: isAvailable ? 1 : 0.4,
                    background: isSelected && isAvailable ? "#ff2d78" : "#ffffff",
                    transition: "all 0.1s ease",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 900,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: isSelected && isAvailable ? "#ffffff" : "#1a1a1a",
                      lineHeight: "1.3",
                    }}
                  >
                    {cat?.name || unit.label || "Unknown"}
                  </p>
                  {unit.code && (
                    <p
                      style={{
                        fontSize: "10px",
                        color: isSelected && isAvailable ? "#ffffffcc" : "#888",
                        marginTop: "2px",
                      }}
                    >
                      {unit.code}
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
