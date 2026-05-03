"use client"

import { HeadbarComponent } from "@/components";
import { TermsConditionComponent } from "../_structures/TermsCondition.component";

export default function TermsSettingPage() {
  return (
    <div className="px-2">
      <HeadbarComponent title="Syarat & Ketentuan" />
      <div className="mt-4">
        <TermsConditionComponent />
      </div>
    </div>
  );
}
