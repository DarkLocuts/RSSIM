import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@utils";

export interface DashboardCardProps {
  title         :  string;
  value         :  string;
  icon          :  IconDefinition;
  iconBgColor  ?:  string;
  iconColor    ?:  string;
  className    ?:  string;
}

export function DashboardCardComponent({
  title,
  value,
  icon,
  iconBgColor  =  "bg-blue-50",
  iconColor    =  "text-primary",
  className
}: DashboardCardProps) {
  return (
    <div className={cn("bg-white py-3 px-4 rounded-xl border", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-[10px] font-bold tracking-wider uppercase text-light-foreground")}>{title}</p>
        </div>
        <div className={cn("w-9 h-9 flex justify-center items-center rounded-md", iconBgColor)}>
          <FontAwesomeIcon icon={icon} className={cn("text-lg", iconColor)} />
        </div>
      </div>
      <h2 className="text-lg font-bold">{value}</h2>
    </div>
  );
}