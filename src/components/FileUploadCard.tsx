import { File, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadCardProps {
  accept: string;
  onFileSelect: (file: File) => void;
  label: string;
  description: string;
  gradient: string;
}

export function FileUploadCard({
  accept,
  onFileSelect,
  label,
  description,
  gradient,
}: FileUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      onFileSelect(file);
    }
  }

  function handleClick() {
    inputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      onFileSelect(file);
    }
  }

  function handleClear() {
    setFileName(null);
    setFileSize(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: Drag-drop area needs div element
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
        isDragging
          ? `border-blue-500 bg-blue-50/50`
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
      }`}
    >
      {/* Animated Background on Drag */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5" />
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {fileName ? (
        <div className="relative flex w-full items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${gradient} p-0.5 shadow-md`}
          >
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
              <File className="h-5 w-5 text-slate-700" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {fileName}
            </p>
            <p className="text-xs text-slate-500">{formatFileSize(fileSize)}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
              isDragging
                ? "bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50"
                : "bg-linear-to-br from-slate-100 to-slate-200 text-slate-400 group-hover:from-slate-200 group-hover:to-slate-300 group-hover:text-slate-500"
            }`}
          >
            <Upload
              className={`h-7 w-7 transition-transform duration-300 ${isDragging ? "scale-110" : "group-hover:scale-110"}`}
            />
          </div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      )}
    </div>
  );
}
