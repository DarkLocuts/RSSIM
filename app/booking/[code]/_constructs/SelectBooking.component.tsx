"use client"

import { ReactNode, Ref, SelectHTMLAttributes } from "react";
import { cn, ValidationRules } from "@utils";
import { SelectComponent } from "@/components";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label      ?:  string;
  placeholder?:  string;
  tip        ?:  string | ReactNode;
  leftIcon   ?:  any;
  rightIcon  ?:  any;

  value        ?:  any;
  invalid      ?:  string;
  options      ?:  { value: any; label: string }[];

  validations   ?:  ValidationRules;

  onChange  ?:  (value: any) => any;
  register  ?:  (name: string, validations?: ValidationRules) => void;

  ref       ?:  Ref<HTMLSelectElement>,

  /** Use custom class with: "label::", "tip::", "error::", "icon::". */
  className  ?:  string;
}

export function SelectBookingComponent({
  label,
  tip,
  leftIcon,
  rightIcon,
  className = "",

  value,
  invalid,
  options = [],

  validations,

  register,
  onChange,

  ...props
}: SelectProps) {
  return (
    <SelectComponent 
      {...props as any}
      label={label}
      tip={tip}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      value={value}
      invalid={invalid}
      options={options}
      validations={validations}
      register={register}
      onChange={onChange}
      className={cn(
        "label::font-bold label::uppercase label::tracking-wider label::text-black label::text-[12px]",
        "input::w-full input::py-3 input::rounded-none input::px-4 input::bg-white input::border-2 input::border-b-4 input::border-r-4 input::!border-black input::focus:!border-4 input::focus:!border-dotted input::focus:!border-[#ff2d78] input::!font-bold input::tracking-widest input::appearance-none",
        "icon::text-black",
        "suggest::bg-white suggest::rounded-none suggest::border-2 suggest::border-b-4 suggest::border-r-4 suggest::!border-black",
        "suggest-item::py-4 suggest-item::hover:text-[#ff2d78] suggest-item::selected:bg-[#ff2d78] suggest-item::selected:text-white suggest-item::selected:font-semibold",
        className
      )}
    />
  );
}
