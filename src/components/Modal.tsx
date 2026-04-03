import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  gradient?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  gradient = "from-blue-500 to-purple-500",
}: ModalProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur and gradient */}
      {/* biome-ignore lint/a11y/useSemanticElements: Backdrop overlay needs div element */}
      <div
        role="button"
        tabIndex={0}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-all duration-500"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClose();
          }
        }}
      />

      {/* Animated Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-linear-to-br ${gradient} opacity-20 blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-linear-to-br ${gradient} opacity-15 blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-lg transform transition-all duration-500 animate-in fade-in zoom-in-95">
        {/* Gradient Border Effect with Animation */}
        <div className="absolute -inset-1 rounded-4xl">
          <div
            className={`absolute inset-0 rounded-4xl bg-linear-to-r ${gradient} opacity-30 blur-xl animate-gradient-xy`}
          />
        </div>

        {/* Main Modal */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/80 shadow-2xl backdrop-blur-2xl backdrop-saturate-150">
          {/* Animated Gradient Header */}
          <div className="relative border-b border-white/20 bg-white/50 px-7 py-6">
            {/* Gradient Line */}
            <div
              className={`absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${gradient}`}
            />

            {/* Decorative Dots */}
            <div className="absolute top-4 right-4 flex gap-1.5 opacity-50">
              <div
                className={`h-2 w-2 rounded-full bg-linear-to-r ${gradient}`}
              />
              <div
                className={`h-2 w-2 rounded-full bg-linear-to-r ${gradient} opacity-60`}
              />
              <div
                className={`h-2 w-2 rounded-full bg-linear-to-r ${gradient} opacity-30`}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r ${gradient} shadow-lg`}
                >
                  <div className="h-5 w-5 rounded-md bg-white/90" />
                </div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="group rounded-xl p-2.5 text-slate-400 transition-all hover:bg-slate-100/80 hover:text-slate-600 hover:shadow-md"
              >
                <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>
          </div>

          {/* Body with Glassmorphism */}
          <div className="px-7 py-7">{children}</div>

          {/* Bottom Gradient Line */}
          <div
            className={`absolute inset-x-0 bottom-0 h-1 bg-linear-to-r ${gradient} opacity-50`}
          />
        </div>
      </div>
    </div>
  );
}
