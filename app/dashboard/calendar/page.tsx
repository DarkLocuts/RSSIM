"use client"

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";


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

const UNIT_COLORS: Record<string, string> = {
  "Iphone 11":     "#d83b20",
  "Iphone 11 putih": "#e8573f",
  "Iphone 12PM":   "#f5a623",
  "Iphone 13":     "#27ae60",
  "Iphone 16":     "#2980b9",
  "Iphone XR":     "#e74c3c",
  "Iphone XI":     "#8e44ad",
  "Iphone XP":     "#1abc9c",
  "Iphone 1":      "#c0392b",
};

function getUnitColor(unitName: string): string {
  return UNIT_COLORS[unitName] || "#68788f";
}


interface BookingEvent {
  id         :  string;
  unitName   :  string;
  startDate  :  string;
  endDate    :  string;
}

const BOOKING_EVENTS: BookingEvent[] = [
  { id: "1",  unitName: "Iphone 11 putih", startDate: "2024-10-16", endDate: "2024-10-18" },
  { id: "2",  unitName: "Iphone 12PM",     startDate: "2024-10-19", endDate: "2024-10-20" },
  { id: "3",  unitName: "Iphone 11",       startDate: "2024-10-19", endDate: "2024-10-21" },
  { id: "4",  unitName: "Iphone 11",       startDate: "2024-10-20", endDate: "2024-10-21" },
  { id: "5",  unitName: "Iphone 11",       startDate: "2024-10-20", endDate: "2024-10-21" },
  { id: "6",  unitName: "Iphone 12PM",     startDate: "2024-10-22", endDate: "2024-10-24" },
  { id: "7",  unitName: "Iphone 11",       startDate: "2024-10-22", endDate: "2024-10-27" },
  { id: "8",  unitName: "Iphone 11",       startDate: "2024-10-22", endDate: "2024-10-23" },
  { id: "9",  unitName: "Iphone 11",       startDate: "2024-10-22", endDate: "2024-10-23" },
  { id: "10", unitName: "Iphone 16",       startDate: "2024-10-23", endDate: "2024-10-24" },
  { id: "11", unitName: "Iphone XI",       startDate: "2024-10-24", endDate: "2024-10-25" },
  { id: "12", unitName: "Iphone 13",       startDate: "2024-10-25", endDate: "2024-10-27" },
  { id: "13", unitName: "Iphone 12PM",     startDate: "2024-10-26", endDate: "2024-10-28" },
  { id: "14", unitName: "Iphone XP",       startDate: "2024-10-27", endDate: "2024-10-28" },
  { id: "15", unitName: "Iphone 11",       startDate: "2024-10-26", endDate: "2024-10-28" },
  { id: "16", unitName: "Iphone 11",       startDate: "2024-10-26", endDate: "2024-10-27" },
  { id: "17", unitName: "Iphone XR",       startDate: "2024-10-29", endDate: "2024-10-31" },
  { id: "18", unitName: "Iphone 16",       startDate: "2024-10-30", endDate: "2024-11-01" },
  { id: "19", unitName: "Iphone 1",        startDate: "2024-10-30", endDate: "2024-10-31" },
  { id: "20", unitName: "Iphone 1",        startDate: "2024-10-31", endDate: "2024-10-31" },
  { id: "21", unitName: "Iphone 11",       startDate: "2024-11-01", endDate: "2024-11-02" },
  { id: "22", unitName: "Iphone 11",       startDate: "2024-11-01", endDate: "2024-11-02" },
  { id: "23", unitName: "Iphone 13",       startDate: "2024-11-04", endDate: "2024-11-04" },
  { id: "24", unitName: "Iphone 11",       startDate: "2024-11-02", endDate: "2024-11-03" },
];

const MAX_VISIBLE_EVENTS  =  3;

interface EventSegment {
  event           :  BookingEvent;
  row             :  number;
  colStart        :  number;
  colSpan         :  number;
  isContinuation  :  boolean;
}



function layoutWeekEvents(events: BookingEvent[], weekDates: (string | null)[]): EventSegment[] {
  const validDates = weekDates.filter(Boolean) as string[];
  if (validDates.length === 0) return [];

  const weekStart  =  validDates[0];
  const weekEnd    =  validDates[validDates.length - 1];

  const intersecting = events.filter((ev) => ev.startDate <= weekEnd && ev.endDate >= weekStart);

  intersecting.sort((a, b) => {
    const durA  =  dateDiff(a.startDate, a.endDate);
    const durB  =  dateDiff(b.startDate, b.endDate);

    if (durB !== durA) return durB - durA;

    return a.startDate.localeCompare(b.startDate);
  });

  const segments: EventSegment[]  =  [];
  const occupied: Set<number>[]   =  Array.from({ length: 7 }, () => new Set());

  for (const ev of intersecting) {
    const segStart        =  ev.startDate < weekStart ? weekStart : ev.startDate;
    const segEnd          =  ev.endDate > weekEnd ? weekEnd : ev.endDate;
    const isContinuation  =  ev.startDate < weekStart;

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
  const [year, setYear]    =  useState(2024);
  const [month, setMonth]  =  useState(9);

  const daysInMonth  =  getDaysInMonth(year, month);
  const firstDay     =  getFirstDayOfMonth(year, month);
  const today        =  15;

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1);
  };

  const calendarCells: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    weeks.push(calendarCells.slice(i, i + 7));
  }

  const weekLayouts = useMemo(() => {
    return weeks.map((week) => {
      const weekDates  =  week.map((day) => day !== null ? toDateKey(year, month, day) : null );
      const segments   =  layoutWeekEvents(BOOKING_EVENTS, weekDates);
      const maxRow     =  segments.length > 0 ? Math.max(...segments.map((s) => s.row)) : -1;

      return { weekDates, segments, maxRow };
    });
  }, [year, month]);

  // const uniqueUnits = useMemo(() => {
  //   const seen = new Set<string>();
  //   BOOKING_EVENTS.forEach((ev) => seen.add(ev.unitName));
  //   return Array.from(seen);
  // }, []);

  return (
    <div className="px-2 pt-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <h1 className="text-xl font-bold text-[#203044]">
          {MONTHS[month]} {year}
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

      <div className="bg-white border rounded-xl p-2 mb-6 overflow-hidden">
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((day) => (
            <div key={day} className="text-center py-1">
              <p className="text-xs font-semibold text-light-foreground uppercase">{day}</p>
            </div>
          ))}
        </div>

        {weeks.map((week, weekIdx) => {
          const { segments, maxRow }  =  weekLayouts[weekIdx];
          const visibleRows           =  Math.min(maxRow + 1, MAX_VISIBLE_EVENTS);
          const hasOverflow           =  maxRow + 1 > MAX_VISIBLE_EVENTS;
          const eventAreaHeight       =  visibleRows * 18;
          const totalHeight           =  22 + eventAreaHeight + (hasOverflow ? 14 : 0) + 4;

          return (
            <div
              key={weekIdx}
              className="grid grid-cols-7 relative"
              style={{
                height: totalHeight,
                borderTop: "1px solid #eef1f6",
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
                    className="flex justify-center pt-0.5"
                    style={{ gridColumn: colIdx + 1 }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: isToday ? "#0050d4" : "transparent",
                      }}
                    >
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: "0.65rem",
                          color: isToday ? "#fff" : "#203044",
                        }}
                      >
                        {day}
                      </span>
                    </div>
                  </div>
                );
              })}

              {segments.filter((seg) => seg.row < MAX_VISIBLE_EVENTS).map((seg) => {
                  const leftPct   =  (seg.colStart / 7) * 100;
                  const widthPct  =  (seg.colSpan / 7) * 100;
                  const top       =  22 + seg.row * 18;
                  const color     =  getUnitColor(seg.event.unitName);

                  return (
                    <div
                      key={`${seg.event.id}-w${weekIdx}`}
                      className="absolute overflow-hidden"
                      style={{
                        left: `calc(${leftPct}% + 1px)`,
                        width: `calc(${widthPct}% - 2px)`,
                        top,
                        height: 16,
                        backgroundColor: color,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 4,
                        paddingRight: 2,
                      }}
                      title={seg.event.unitName}
                    >
                      <span
                        className="font-semibold truncate"
                        style={{
                          fontSize: "0.55rem",
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        {seg.isContinuation ? "" : seg.event.unitName}
                      </span>
                    </div>
                  );
                })}

              {/* Overflow "..." indicators per day */}
              {hasOverflow &&
                week.map((day, colIdx) => {
                  if (day === null) return null;
                  // Count events in this column that exceed visible slots
                  const overflowCount = segments.filter(
                    (s) =>
                      s.row >= MAX_VISIBLE_EVENTS &&
                      colIdx >= s.colStart &&
                      colIdx < s.colStart + s.colSpan,
                  ).length;
                  if (overflowCount === 0) return null;

                  const leftPct = (colIdx / 7) * 100;
                  return (
                    <div
                      key={`overflow-${weekIdx}-${colIdx}`}
                      className="absolute"
                      style={{
                        left: `${leftPct}%`,
                        width: `${100 / 7}%`,
                        top: 22 + MAX_VISIBLE_EVENTS * 18,
                        height: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="font-bold text-[#68788f]"
                        style={{ fontSize: "0.6rem" }}
                      >
                        •••
                      </span>
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>

      {/* <div className="bg-white rounded-[1.25rem] p-4 mb-6">
        <p className="text-xs font-semibold text-[#68788f] uppercase tracking-wider mb-3">
          Keterangan Unit
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {uniqueUnits.map((unit) => (
            <div key={unit} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: getUnitColor(unit) }}
              />
              <span className="text-xs text-[#203044] font-medium">{unit}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
