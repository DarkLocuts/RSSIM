"use client"

import { useState, useEffect } from "react";
import { ButtonComponent } from "@/components";
import { api } from "@/utils";

export function TermsConditionComponent() {
  const [content, setContent]    =  useState("");
  const [loading, setLoading]    =  useState(true);
  const [saving, setSaving]      =  useState(false);
  const [saved, setSaved]        =  useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await api({ path: "settings", method: "GET", params: { key: "terms_and_conditions" } as any });
      if (res?.status === 200) {
        const val = res?.data?.data?.terms_and_conditions || "";
        setContent(val);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await api({
      path: "settings/terms_and_conditions",
      method: "PUT",
      payload: { value: content }
    });
    if (res?.status === 200) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-xl border p-4">
      <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Syarat & Ketentuan</h3>
      {loading ? (
        <div className="text-sm text-light-foreground py-4 text-center">Memuat...</div>
      ) : (
        <>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            placeholder="Tulis syarat dan ketentuan sewa di sini..."
          />
          <div className="flex items-center gap-2 mt-3">
            <ButtonComponent
              label={saving ? "Menyimpan..." : "Simpan"}
              size="sm"
              rounded
              onClick={handleSave}
              loading={saving}
            />
            {saved && <span className="text-xs text-success font-semibold">Tersimpan!</span>}
          </div>
        </>
      )}
    </div>
  );
}
