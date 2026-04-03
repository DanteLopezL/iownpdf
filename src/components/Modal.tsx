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
      {/* Backdrop with blur */}
      {/* biome-ignore lint/a11y/useSemanticElements: Backdrop overlay needs div element */}
      <div
        role="button"
        tabIndex={0}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClose();
          }
        }}
      />

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-lg transform transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Gradient Border Effect */}
        <div
          className={`absolute -inset-0.5 rounded-3xl bg-linear-to-r ${gradient} opacity-20 blur-sm`}
        />

        {/* Main Modal */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-2xl">
          {/* Header with gradient line */}
          <div className="relative border-b border-slate-200/50 bg-white px-6 py-5">
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${gradient}`}
            />
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
