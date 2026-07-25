import React from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium text-slate-300">
        <span>{label}</span>
        <span className="text-emerald-400 font-mono">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
      />
    </div>
  );
}
