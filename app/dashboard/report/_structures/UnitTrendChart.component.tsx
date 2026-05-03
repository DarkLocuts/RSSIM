"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ButtonComponent } from '@components';

interface UnitTrendEntry {
  month  :  string;
  [key: string]: number | string; // dynamic keys per unit category
}

interface CategoryInfo {
  key    :  string;
  name   :  string;
  color  :  string;
}

interface UnitTrendChartProps {
  data        :  UnitTrendEntry[];
  categories  :  CategoryInfo[];
  title      ?:  string;
  subtitle   ?:  string;
}

export const UnitTrendChartComponent: React.FC<UnitTrendChartProps> = ({ 
  data,
  categories,
  title = "Tren Pesanan Per Unit",
  subtitle = "Jumlah pesanan per jenis unit per bulan"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set(categories.map(c => c.key)));

  useEffect(() => {
    setVisibleCategories(new Set(categories.map(c => c.key)));
  }, [categories]);

  const displayData = useMemo(() => data || [], [data]);

  const toggleCategory = (key: string) => {
    setVisibleCategories(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => { draw(); });
    });
    if (canvasRef.current?.parentElement) observer.observe(canvasRef.current.parentElement);
    return () => observer.disconnect();
  }, [displayData, visibleCategories]);

  useEffect(() => {
    const timer = setTimeout(draw, 50);
    const timer2 = setTimeout(draw, 300);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, [displayData, visibleCategories]);

  const setChartPath = (ctx: CanvasRenderingContext2D, points: {x: number, y: number}[], tension: number = 0.2) => {
    if (points.length < 2) return;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i], p2 = points[i+1];
      const p0 = points[i-1] || p1, p3 = points[i+2] || p2;
      let cp1y = p1.y + (p2.y - p0.y) * tension;
      let cp2y = p2.y - (p3.y - p1.y) * tension;
      if (p1.y === p2.y) { cp1y = p1.y; cp2y = p2.y; }
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = Math.round(parent.clientWidth);
    const height = Math.round(parent.clientHeight);
    if (width === 0 || height === 0) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, width, height);

    if (displayData.length === 0 || categories.length === 0) return;

    const padding = { top: 40, right: 50, bottom: 45, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const visibleCats = categories.filter(c => visibleCategories.has(c.key));
    const allValues = displayData.flatMap(d => visibleCats.map(c => Number(d[c.key]) || 0));
    const maxVal = Math.max(...allValues, 5) * 1.2;
    const minVal = 0;
    const range = maxVal - minVal || 1;

    const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
    const getX = (index: number) => padding.left + (displayData.length > 1 ? (index / (displayData.length - 1)) * chartWidth : chartWidth / 2);

    // Grid
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1;
    [0.0, 0.25, 0.5, 0.75, 1.0].forEach(fraction => {
      const y = padding.top + chartHeight - fraction * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    });

    // Draw lines per category
    for (const cat of visibleCats) {
      const points = displayData.map((d, i) => ({
        x: getX(i),
        y: getY(Number(d[cat.key]) || 0)
      }));

      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = cat.color;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      setChartPath(ctx, points);
      ctx.stroke();

      // Dots
      points.forEach((p, i) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = cat.color;
        ctx.fill();
        ctx.strokeStyle = cat.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Value labels
        ctx.fillStyle = cat.color;
        ctx.font = `bold 10px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(String(Number(displayData[i][cat.key]) || 0), p.x, p.y - 10);
      });
    }

    // X-axis labels
    displayData.forEach((d, i) => {
      ctx.fillStyle = '#424242';
      ctx.font = `600 10px 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(d.month, getX(i), padding.top + chartHeight + 35);
    });
  };

  if (!data || data.length === 0 || categories.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 transition-all">
      <div className="flex justify-between items-start px-4 pt-4">
        <div>
          <h3 className="text-slate-900 font-bold text-lg tracking-tight">{title}</h3>
          <p className="text-slate-500 text-xs font-medium mb-3">{subtitle}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map(cat => (
              <div key={cat.key} style={{ opacity: visibleCategories.has(cat.key) ? 1 : 0.6 }}>
                <ButtonComponent
                  size="xs"
                  variant={visibleCategories.has(cat.key) ? "solid" : "outline"}
                  label={cat.name}
                  onClick={() => toggleCategory(cat.key)}
                  rounded
                  className="text-[10px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative h-70 w-full overflow-hidden px-2 mb-4">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
