"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@components';
import { useResponsive } from '@/utils';

interface ChartData {
  month    :  string;
  income   :  number;
  expense  :  number;
}

interface FinancialChartProps {
  data       :  ChartData[];
  title     ?:  string;
  subtitle  ?:  string;
}

export const FinancialChartComponent: React.FC<FinancialChartProps> = ({ 
  data, 
  title = "Pemasukan vs Pengeluaran",
  subtitle = "Tren keuangan per bulan"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showIncome, setShowIncome] = useState(true);
  const [showExpense, setShowExpense] = useState(true);
  const { isSm } = useResponsive();

  useEffect(() => {
    !isSm && setIsMaximized(true)
  }, [isSm])

  const displayData = useMemo(() => {
    return data || [];
  }, [data]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => { drawAll(); });
    });
    if (canvasRef.current?.parentElement) observer.observe(canvasRef.current.parentElement);
    if (maxCanvasRef.current?.parentElement) observer.observe(maxCanvasRef.current.parentElement);
    return () => observer.disconnect();
  }, [displayData, isMaximized, showIncome, showExpense]);

  useEffect(() => {
    const timer = setTimeout(drawAll, 50);
    const timer2 = setTimeout(drawAll, 300);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, [isMaximized, displayData, showIncome, showExpense]);

  const drawAll = () => {
    if (isSm && isMaximized) {
      draw(maxCanvasRef.current, true);
    } else {
      draw(canvasRef.current, false);
    }
  };

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

  const draw = (canvas: HTMLCanvasElement | null, maximized: boolean) => {
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

    if (displayData.length === 0) return;

    const padding = maximized
      ? { top: 40, right: 60, bottom: 70, left: 60 }
      : { top: 40, right: 50, bottom: 45, left: 40 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const allValues = [
      ...(showIncome ? displayData.map(d => d.income) : []),
      ...(showExpense ? displayData.map(d => d.expense) : []),
      10
    ];
    const maxVal = Math.max(...allValues) * 1.2;
    const minVal = 0;
    const range = maxVal - minVal || 1;

    const getY = (val: number) => padding.top + chartHeight - ((val - minVal) / range) * chartHeight;
    const getX = (index: number) => padding.left + (index / (displayData.length - 1)) * chartWidth;

    // Grid
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1;
    const gridFractions = [0.0, 0.25, 0.5, 0.75, 1.0];
    gridFractions.forEach(fraction => {
      const y = padding.top + chartHeight - fraction * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    });

    // Y-axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = `bold ${maximized ? '12px' : '10px'} 'Inter', sans-serif`;
    ctx.textAlign = 'right';
    gridFractions.forEach(fraction => {
      const v = minVal + (range * fraction);
      const label = v >= 1000000 ? `${(v/1000000).toFixed(1)}jt` : v >= 1000 ? `${(v/1000).toFixed(0)}rb` : Math.round(v).toString();
      ctx.fillText(label, padding.left - 10, getY(v) + 4);
    });

    const incomePoints = displayData.map((d, i) => ({ x: getX(i), y: getY(d.income) }));
    const expensePoints = displayData.map((d, i) => ({ x: getX(i), y: getY(d.expense) }));

    if (showIncome) {
      ctx.beginPath();
      ctx.lineWidth = maximized ? 2 : 1.5;
      ctx.strokeStyle = '#22c55e';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      setChartPath(ctx, incomePoints);
      ctx.stroke();

      displayData.forEach((d, i) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(incomePoints[i].x, incomePoints[i].y, maximized ? 4 : 3, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = maximized ? 3 : 2;
        ctx.stroke();
        ctx.restore();
      });
    }

    if (showExpense) {
      ctx.beginPath();
      ctx.lineWidth = maximized ? 2 : 1.5;
      ctx.strokeStyle = '#ef4444';
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      setChartPath(ctx, expensePoints);
      ctx.stroke();

      displayData.forEach((d, i) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(expensePoints[i].x, expensePoints[i].y, maximized ? 4 : 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = maximized ? 3 : 2;
        ctx.stroke();
        ctx.restore();
      });
    }

    // X-axis labels
    displayData.forEach((d, i) => {
      ctx.fillStyle = '#424242';
      ctx.font = `${maximized ? '700 14px' : '600 10px'} 'Inter', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(d.month, getX(i), padding.top + chartHeight + (maximized ? 50 : 35));
    });
  };

  if (!data || data.length === 0) return null;

  return (
    <>
      <div className={`bg-white rounded-xl border border-slate-200 transition-all ${isSm && isMaximized ? 'hidden' : 'block'}`}>
        <div className="flex justify-between items-start px-4 pt-4">
          <div>
            <h3 className="text-slate-900 font-bold text-lg tracking-tight">{title}</h3>
            <p className="text-slate-500 text-xs font-medium mb-3">{subtitle}</p>
            <div className="flex items-center gap-2">
              <ButtonComponent size="xs" variant={showIncome ? "solid" : "outline"} paint="success" label="Pemasukan" onClick={() => setShowIncome(!showIncome)} rounded />
              <ButtonComponent size="xs" variant={showExpense ? "solid" : "outline"} paint="danger" label="Pengeluaran" onClick={() => setShowExpense(!showExpense)} rounded />
            </div>
          </div>
          {isSm && (
            <button onClick={toggleMaximize} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all border border-slate-100 hover:border-cyan-100 shadow-sm active:scale-95">
              <FontAwesomeIcon icon={faExpand} className="text-lg" />
            </button>
          )}
        </div>
        <div className="relative h-70 w-full overflow-hidden px-2 mb-4">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>

      {isSm && isMaximized && (
        <div className="fixed inset-0 z-[999] bg-slate-950/98 backdrop-blur-2xl flex items-center justify-center p-0 md:p-12">
          <div className="bg-white w-full h-full md:rounded-3xl flex flex-col overflow-hidden relative"
            style={typeof window !== 'undefined' && window.innerWidth < 768 && window.innerHeight > window.innerWidth ? {
              width: '100vh', height: '100vw', position: 'fixed',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(90deg)', transformOrigin: 'center center'
            } : {}}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-slate-900 font-bold text-xl tracking-tight">{title}</h3>
                <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <ButtonComponent size="xs" variant={showIncome ? "solid" : "outline"} paint="success" label="Pemasukan" onClick={() => setShowIncome(!showIncome)} rounded />
                <ButtonComponent size="xs" variant={showExpense ? "solid" : "outline"} paint="danger" label="Pengeluaran" onClick={() => setShowExpense(!showExpense)} rounded />
              </div>
              <button onClick={toggleMaximize} className="w-12 h-12 flex items-center justify-center hover:text-white rounded-2xl transition-all active:scale-90 shadow-sm border">
                <FontAwesomeIcon icon={faCompress} className="text-xl" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-0 bg-white">
              <div className="w-full h-full relative">
                <canvas ref={maxCanvasRef} className="w-full h-full block" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
