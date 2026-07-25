"use client";

import { WatermarkOptions } from "@/types";
import { Slider } from "../ui/Slider";
import { Input } from "../ui/Input";

interface WatermarkSettingsProps {
  options: WatermarkOptions;
  onChange: (options: WatermarkOptions) => void;
}

export function WatermarkSettings({ options, onChange }: WatermarkSettingsProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Watermark Text"
        value={options.text}
        onChange={(e) => onChange({ ...options, text: e.target.value })}
        placeholder="e.g. CONFIDENTIAL"
      />

      <Slider
        label="Opacity"
        value={Math.round(options.opacity * 100)}
        min={5}
        max={100}
        unit="%"
        onChange={(val) => onChange({ ...options, opacity: val / 100 })}
      />

      <Slider
        label="Rotation Angle"
        value={options.rotation}
        min={-90}
        max={90}
        unit="°"
        onChange={(val) => onChange({ ...options, rotation: val })}
      />

      <Slider
        label="Font Size"
        value={options.fontSize || 48}
        min={12}
        max={120}
        unit="px"
        onChange={(val) => onChange({ ...options, fontSize: val })}
      />

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <span className="text-xs font-medium text-slate-300">Tile Watermark Across Page</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={options.repeat || false}
            onChange={(e) => onChange({ ...options, repeat: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>
    </div>
  );
}
