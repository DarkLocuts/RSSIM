"use client"

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useGetApi } from "@utils";

const DAYS    =  ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS  =  ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface BookingEvent {
  id                   :  string;
  unit_name            :  string;
  unit_category_color  :  string;
  start_at             :  string;
  end_at               :  string;
}

interface EventSegment {
  event           :  BookingEvent;
  row             :  number;
  colStart        :  number;
  colSpan         :  number;
  isContinuation  :  boolean;
}



function layoutWeekEvents(events: BookingEvent[], weekDates: (string | null)[]): EventSegment[] {
  const validDates = (weekDates || []).filter(Boolean) as string[];
  if (validDates.length === 0) return [];

  const weekStart  =  validDates[0];
  const weekEnd    =  validDates[validDates.length - 1];

  const intersecting = (events || []).filter((ev) => {
    const evStart = ev.start_at.substring(0, 10);
    const evEnd = ev.end_at.substring(0, 10);
    return evStart <= weekEnd && evEnd >= weekStart;
  });

  intersecting.sort((a, b) => {
    const aStart = a.start_at.substring(0, 10);
    const aEnd = a.end_at.substring(0, 10);
    const bStart = b.start_at.substring(0, 10);
    const bEnd = b.end_at.substring(0, 10);

    const durA  =  dateDiff(aStart, aEnd);
    const durB  =  dateDiff(bStart, bEnd);

    if (durB !== durA) return durB - durA;

    return aStart.localeCompare(bStart);
  });

  const segments: EventSegment[]  =  [];
  const occupied: Set<number>[]   =  Array.from({ length: 7 }, () => new Set());

  for (const ev of intersecting) {
    const evStart = ev.start_at.substring(0, 10);
    const evEnd = ev.end_at.substring(0, 10);

    const segStart        =  evStart < weekStart ? weekStart : evStart;
    const segEnd          =  evEnd > weekEnd ? weekEnd : evEnd;
    const isContinuation  =  evStart < weekStart;

    const colStart  =  weekDates.indexOf(segStart);
    const colEnd    =  weekDates.indexOf(segEnd);

    if (colStart === -1 || colEnd === -1) continue;
    
    const colSpan  =  colEnd - colStart + 1;

    let row    =  0;
    let found  =  false;

    while (!found) {
      found = true;
      for (let c = colStart; c <= colEnd; c++) {
        if (occupied[c].has(row)) {
          found = false;
          row++;
          break;
        }
      }
    }

    for (let c = colStart; c <= colEnd; c++) {
      occupied[c].add(row);
    }

    segments.push({ event: ev, row, colStart, colSpan, isContinuation });
  }

  return segments;
}

function dateDiff(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 86400000;
}


export default function CalenderPage() {
  const [month, setMonth] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  const [yearStr, monthStr] = month.split("-");
  const yearNum  = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10) - 1;

  const { data } = useGetApi({
    path: `booking-calendar/${month}`,
  });

  const daysInMonth  =  getDaysInMonth(yearNum, monthNum);
  const firstDay     =  getFirstDayOfMonth(yearNum, monthNum);
  
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === yearNum && now.getMonth() === monthNum;
  const today = isCurrentMonth ? now.getDate() : -1;

  const prevMonth = () => {
    let y = yearNum;
    let m = monthNum - 1;
    if (m < 0) { m = 11; y--; }
    setMonth(`${y}-${String(m + 1).padStart(2, "0")}`);
  };

  const nextMonth = () => {
    let y = yearNum;
    let m = monthNum + 1;
    if (m > 11) { m = 0; y++; }
    setMonth(`${y}-${String(m + 1).padStart(2, "0")}`);
  };

  const weeks = useMemo(() => {
    const calendarCells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

    while (calendarCells.length % 7 !== 0) calendarCells.push(null);

    const weeksArr: (number | null)[][] = [];
    for (let i = 0; i < calendarCells.length; i += 7) {
      weeksArr.push(calendarCells.slice(i, i + 7));
    }
    return weeksArr;
  }, [daysInMonth, firstDay]);

  const weekLayouts = useMemo(() => {
    return weeks.map((week) => {
      const weekDates  =  week.map((day) => day !== null ? toDateKey(yearNum, monthNum, day) : null );
      const segments   =  layoutWeekEvents(data?.data || [], weekDates);
      const maxRow     =  segments.length > 0 ? Math.max(...segments.map((s) => s.row)) : -1;

      return { weekDates, segments, maxRow };
    });
  }, [yearNum, monthNum, data, weeks]);

  return (
    <div className="px-2 pt-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <h1 className="text-xl font-bold text-[#203044]">
          {MONTHS[monthNum]} {yearNum}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-full bg-white border flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          </button>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-full bg-white border flex items-center justify-center cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-xl py-2 mb-6 overflow-hidden">
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((day) => (
            <div key={day} className="text-center py-2">
              <p className="text-xs font-semibold text-light-foreground uppercase">{day}</p>
            </div>
          ))}
        </div>

        {weeks.map((week, weekIdx) => {
          const { segments, maxRow }  =  weekLayouts[weekIdx];
          const visibleRows           =  maxRow + 1;
          const eventAreaHeight       =  visibleRows * 18;
          const totalHeight           =  40 + eventAreaHeight + 4;

          return (
            <div
              key={weekIdx}
              className="grid grid-cols-7 relative border-t"
              style={{
                height: totalHeight,
              }}
            >
              {week.map((day, colIdx) => {
                if (day === null) {
                  return <div key={`empty-${weekIdx}-${colIdx}`} />;
                }
                const isToday = day === today;
                return (
                  <div
                    key={`date-${weekIdx}-${colIdx}`}
                    className="flex justify-center py-2"
                    style={{ gridColumn: colIdx + 1 }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isToday ? "border !border-primary" : ""}`}>
                      <span className={`font-semibold text-xs ${isToday ? "text-primary" : ""}`}>
                        {day}
                      </span>
                    </div>
                  </div>
                );
              })}

              {segments.map((seg) => {
                  const leftPct   =  (seg.colStart / 7) * 100;
                  const widthPct  =  (seg.colSpan / 7) * 100;
                  const top       =  34 + seg.row * 18;

                  return (
                    <div
                      key={`${seg.event.id}-w${weekIdx}`}
                      className="absolute overflow-hidden"
                      style={{
                        left: `calc(${leftPct}% + 1px)`,
                        width: `calc(${widthPct}% - 2px)`,
                        top,
                        height: 16,
                        backgroundColor: seg.event.unit_category_color,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 4,
                        paddingRight: 2,
                      }}
                      title={seg.event.unit_name}
                    >
                      <span className="font-semibold truncate text-white text-xs line-clamp-1">
                        {seg.isContinuation ? "" : seg.event.unit_name}
                      </span>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
