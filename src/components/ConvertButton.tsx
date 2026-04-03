import type { LucideIcon } from "lucide-react";
import { ArrowRight, Sparkles } from "lucide-react";

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
      className="group relative flex w-full flex-col items-start overflow-hidden rounded-3xl border border-white/20 bg-white/60 p-7 text-left shadow-lg backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-slate-300/40 hover:border-white/40"
    >
      {/* Animated Gradient Background on Hover */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 blur-xl transition-all duration-700 group-hover:opacity-10`}
      />

      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 animate-[shimmer_2s_ease-in-out_infinite]" />
      </div>

      {/* Floating Badge */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-linear-to-r ${gradient} shadow-lg`}
        >
          <Sparkles className="h-3 w-3 text-white" />
          <span className="text-xs font-semibold text-white">Click</span>
        </div>
      </div>

      {/* Icon with Multiple Layers */}
      <div className="relative mb-5">
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 rounded-2xl bg-linear-to-br ${gradient} blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
        />

        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${gradient} p-0.5 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/95 backdrop-blur-sm">
            <Icon
              className={`h-7 w-7 ${textColor} transition-transform duration-300 group-hover:scale-110`}
            />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <h3 className="relative text-xl font-bold text-slate-900 transition-all duration-300 group-hover:text-slate-800 group-hover:tracking-tight">
        {label}
      </h3>
      <p className="relative mt-2 text-sm font-medium text-slate-600 leading-relaxed">
        {description}
      </p>

      {/* Arrow Indicator with Line */}
      <div className="relative mt-5 w-full">
        <div className="h-px w-0 bg-linear-to-r from-transparent via-slate-300 to-transparent group-hover:w-full transition-all duration-500" />
        <div
          className={`mt-3 flex items-center gap-2 text-sm font-semibold ${textColor} opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300`}
        >
          <span>Convert now</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </div>
    </button>
  );
}
