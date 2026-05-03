"use client"

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useGetApi, conversion } from "@utils";
import Link from "next/link";
import { BottomSheetComponent } from "@/components";

const DAYS    =  ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS  =  ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

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
  customer_name       ?:  string;
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

const MAX_VISIBLE_ROWS = 3;

export default function CalenderPage() {
  const [month, setMonth] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDayDetail, setShowDayDetail] = useState(false);

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

  const selectMonth = (m: number) => {
    setMonth(`${pickerYear}-${String(m + 1).padStart(2, "0")}`);
    setShowMonthPicker(false);
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

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate || !data?.data) return [];
    return (data.data as BookingEvent[]).filter((ev) => {
      const evStart = ev.start_at.substring(0, 10);
      const evEnd = ev.end_at.substring(0, 10);
      return evStart <= selectedDate && evEnd >= selectedDate;
    });
  }, [selectedDate, data]);

  // Count overflow per cell
  const getOverflowCount = (weekIdx: number, colIdx: number) => {
    const { segments } = weekLayouts[weekIdx];
    const cellSegments = segments.filter(s => colIdx >= s.colStart && colIdx < s.colStart + s.colSpan);
    const hiddenCount = cellSegments.filter(s => s.row >= MAX_VISIBLE_ROWS).length;
    return hiddenCount;
  };

  return (
    <div className="px-2 pt-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          onClick={() => {
            setPickerYear(yearNum);
            setShowMonthPicker(!showMonthPicker);
          }}
          className="text-xl font-bold text-[#203044] hover:text-primary transition-colors cursor-pointer"
        >
          {MONTHS[monthNum]} {yearNum}
        </button>
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

      {/* Month/Year Picker */}
      <BottomSheetComponent
        show={showMonthPicker}
        onClose={() => setShowMonthPicker(false)}
        size={400}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setPickerYear(pickerYear - 1)} className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer active:bg-gray-100">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className="font-bold text-xl">{pickerYear}</span>
            <button onClick={() => setPickerYear(pickerYear + 1)} className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer active:bg-gray-100">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MONTHS_SHORT.map((m, i) => {
              const isSelected = pickerYear === yearNum && i === monthNum;
              return (
                <button
                  key={i}
                  onClick={() => selectMonth(i)}
                  className={`py-4 rounded-xl text-sm font-bold transition-colors cursor-pointer ${isSelected ? "bg-primary text-white" : "bg-gray-50 text-foreground"}`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      </BottomSheetComponent>

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
          const visibleRows           =  Math.min(maxRow + 1, MAX_VISIBLE_ROWS);
          const eventAreaHeight       =  visibleRows * 26;
          const hasOverflow           =  maxRow >= MAX_VISIBLE_ROWS;
          const totalHeight           =  40 + eventAreaHeight + (hasOverflow ? 18 : 0) + 4;

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
                const dateKey = toDateKey(yearNum, monthNum, day);

                return (
                  <div
                    key={`date-${weekIdx}-${colIdx}`}
                    className="flex flex-col items-center py-2 cursor-pointer"
                    style={{ gridColumn: colIdx + 1 }}
                    onClick={() => {
                      setSelectedDate(dateKey);
                      setShowDayDetail(true);
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isToday ? "border !border-primary" : ""}`}>
                      <span className={`font-semibold text-xs ${isToday ? "text-primary" : ""}`}>
                        {day}
                      </span>
                    </div>
                  </div>
                );
              })}

              {segments.filter(seg => seg.row < MAX_VISIBLE_ROWS).map((seg) => {
                  const leftPct   =  (seg.colStart / 7) * 100;
                  const widthPct  =  (seg.colSpan / 7) * 100;
                  const top       =  34 + seg.row * 26;

                  return (
                    <Link href={`/dashboard/booking/${seg.event.id}`} key={`${seg.event.id}-w${weekIdx}`}>
                      <div
                        className="absolute overflow-hidden"
                        style={{
                          left: `calc(${leftPct}% + 1px)`,
                          width: `calc(${widthPct}% - 2px)`,
                          top,
                          height: 24,
                          backgroundColor: seg.event.unit_category_color,
                          borderRadius: 0,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 6,
                          paddingRight: 6,
                        }}
                        title={seg.event.unit_name}
                      >
                        <span className="font-semibold truncate text-white text-xs line-clamp-1">
                          {seg.isContinuation ? "" : seg.event.unit_name}
                        </span>
                      </div>
                    </Link>
                  );
                })}

              {week.map((day, colIdx) => {
                if (day === null) return null;
                const overflow = getOverflowCount(weekIdx, colIdx);
                if (overflow <= 0) return null;

                const dateKey = toDateKey(yearNum, monthNum, day);
                const leftPct = (colIdx / 7) * 100;
                const top = 34 + MAX_VISIBLE_ROWS * 26;

                return (
                  <div
                    key={`overflow-${weekIdx}-${colIdx}`}
                    className="absolute text-center cursor-pointer z-10"
                    style={{
                      left: `${leftPct}%`,
                      width: `${100/7}%`,
                      top: `${top}px`,
                    }}
                    onClick={() => {
                      setSelectedDate(dateKey);
                      setShowDayDetail(true);
                    }}
                  >
                    <span className="text-[10px] font-bold text-primary">+{overflow}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Day Detail BottomSheet */}
      <BottomSheetComponent
        show={showDayDetail}
        onClose={() => setShowDayDetail(false)}
        size="98vh"
      >
        <div className="p-2">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4 px-2">
            Pesanan {selectedDate ? conversion.date(selectedDate, "DD MMMM YYYY") : ""}
          </h3>

          {selectedDateEvents.length === 0 ? (
            <div className="text-center py-8 text-sm text-light-foreground">
              Tidak ada pesanan di tanggal ini
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedDateEvents.map((ev) => (
                <Link href={`/dashboard/booking/${ev.id}`} key={ev.id}>
                  <div className="border rounded-lg p-3 flex items-center gap-3 bg-white hover:bg-gray-50 transition-colors">
                    {/* <div
                      className="w-3 h-full min-h-[40px] rounded-full flex-shrink-0"
                      style={{ backgroundColor: ev.unit_category_color }}
                    /> */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold truncate">{ev.customer_name || "-"}</p>
                          <p className="text-[10px] text-light-foreground mt-1">
                            {conversion.date(ev.start_at, "DD/MM HH:mm")} s/d {conversion.date(ev.end_at, "DD/MM HH:mm")}
                          </p>
                        </div>
                        <p className="text-xs text-white font-semibold py-2 px-4 rounded-md" style={{ backgroundColor: ev.unit_category_color }}>{ev.unit_name}</p>
                      </div>
                      
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </BottomSheetComponent>
    </div>
  );
}
