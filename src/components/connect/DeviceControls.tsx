import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface DeviceControlsProps {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onA?: () => void;
  onB?: () => void;
  onMenu?: () => void;
  disabled?: boolean;
}

export const DeviceControls = ({
  onUp,
  onDown,
  onLeft,
  onRight,
  onA,
  onB,
  onMenu,
  disabled = false,
}: DeviceControlsProps) => {
  const buttonClass = cn(
    "w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 active:bg-gray-500 flex items-center justify-center transition-all shadow-md active:shadow-sm",
    disabled && "opacity-50 cursor-not-allowed"
  );

  const abButtonClass = cn(
    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md active:shadow-sm transition-all",
    disabled && "opacity-50 cursor-not-allowed"
  );

  return (
    <div className="flex items-center justify-between px-4 py-2">
      {/* D-Pad */}
      <div className="relative w-28 h-28">
        {/* Up */}
        <button
          onClick={onUp}
          disabled={disabled}
          className={cn(buttonClass, "absolute top-0 left-1/2 -translate-x-1/2")}
        >
          <ChevronUp className="w-5 h-5 text-gray-600" />
        </button>
        {/* Down */}
        <button
          onClick={onDown}
          disabled={disabled}
          className={cn(buttonClass, "absolute bottom-0 left-1/2 -translate-x-1/2")}
        >
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </button>
        {/* Left */}
        <button
          onClick={onLeft}
          disabled={disabled}
          className={cn(buttonClass, "absolute left-0 top-1/2 -translate-y-1/2")}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        {/* Right */}
        <button
          onClick={onRight}
          disabled={disabled}
          className={cn(buttonClass, "absolute right-0 top-1/2 -translate-y-1/2")}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        {/* Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200" />
      </div>

      {/* A/B Buttons */}
      <div className="flex flex-col gap-2 items-end">
        <div className="flex gap-3 items-center">
          {/* B Button */}
          <button
            onClick={onB}
            disabled={disabled}
            className={cn(abButtonClass, "bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700")}
          >
            B
          </button>
          {/* A Button */}
          <button
            onClick={onA}
            disabled={disabled}
            className={cn(abButtonClass, "bg-gray-800 hover:bg-gray-900 active:bg-black text-white")}
          >
            A
          </button>
        </div>
        {/* Menu Button */}
        <button
          onClick={onMenu}
          disabled={disabled}
          className={cn(
            "px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded text-xs font-bold text-gray-600 shadow-md transition-all",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          menu
        </button>
      </div>
    </div>
  );
};
