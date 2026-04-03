import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface ConvertButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick: () => void;
  gradient: string;
  bgColor: string;
  textColor: string;
}

export function ConvertButton({
  icon: Icon,
  label,
  description,
  onClick,
  gradient,
  textColor,
}: ConvertButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col items-start overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 p-6 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50"
    >
      {/* Hover Gradient Background */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
      />

      {/* Icon */}
      <div
        className={`relative mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${gradient} p-0.5 shadow-lg transition-shadow duration-300 group-hover:shadow-xl`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
      </div>

      {/* Text */}
      <h3 className="relative text-lg font-bold text-slate-900 transition-colors group-hover:text-slate-800">
        {label}
      </h3>
      <p className="relative mt-1 text-sm text-slate-600">{description}</p>

      {/* Arrow Indicator */}
      <div
        className={`relative mt-4 flex items-center gap-2 text-sm font-medium ${textColor} opacity-0 transition-all duration-300 group-hover:opacity-100`}
      >
        <span>Convert now</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}
