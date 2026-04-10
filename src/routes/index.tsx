import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import {
  ArrowRight,
  CheckCircle2,
  FileEdit,
  FileText,
  Loader2,
  Presentation,
  Shield,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { ComingSoonCard } from "#/components/ComingSoonCard";
import { ConvertButton } from "#/components/ConvertButton";
import { Modal } from "#/components/Modal";
import { ThemeToggle } from "#/components/ThemeToggle";

export const Route = createFileRoute("/")({ component: App });

type FileType = "md" | "pptx" | "docx" | null;
type ConversionState = "idle" | "converting" | "success" | "error";

const fileConfigs = {
  md: {
    label: "Select a Markdown file",
    description: "Only .md and .markdown files are allowed",
    title: "Convert Markdown",
    icon: FileText,
    accentColor: "var(--color-accent-blue)",
    accentBg: "var(--color-accent-blue-subtle)",
    descriptionText: "Markdown to PDF",
  },
  pptx: {
    label: "Select a PowerPoint file",
    description: "Only .pptx files are allowed",
    title: "Convert PowerPoint",
    icon: Presentation,
    accentColor: "var(--color-accent-orange)",
    accentBg: "var(--color-accent-orange-subtle)",
    descriptionText: "PowerPoint to PDF",
  },
  docx: {
    label: "Select a Word file",
    description: "Only .docx files are allowed",
    title: "Convert Word",
    icon: FileEdit,
    accentColor: "var(--color-accent-purple)",
    accentBg: "var(--color-accent-purple-subtle)",
    descriptionText: "Word to PDF",
  },
};

const comingSoonConfigs = [
  {
    label: "PDF to Markdown",
    description: "Extract text and structure from PDF into Markdown",
    icon: FileText,
    accentColor: "var(--color-accent-blue)",
    accentBg: "var(--color-accent-blue-subtle)",
  },
  {
    label: "PDF to Word",
    description: "Convert PDF back into an editable Word document",
    icon: FileEdit,
    accentColor: "var(--color-accent-purple)",
    accentBg: "var(--color-accent-purple-subtle)",
  },
  {
    label: "PDF to PowerPoint",
    description: "Transform PDF slides into a PowerPoint deck",
    icon: Presentation,
    accentColor: "var(--color-accent-orange)",
    accentBg: "var(--color-accent-orange-subtle)",
  },
];

function App() {
  const [openModal, setOpenModal] = useState<FileType>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [conversionState, setConversionState] =
    useState<ConversionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successPath, setSuccessPath] = useState<string | null>(null);

  async function handlePickFile() {
    if (!openModal) return;

    try {
      const filePath = await invoke<string | null>("pick_file", {
        fileType: openModal,
      });

      if (!filePath) return;

      const fileName = filePath.split("/").pop() || filePath;

      setSelectedFilePath(filePath);
      setSelectedFileName(fileName);
      setConversionState("idle");
      setError(null);
      setSuccessPath(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setConversionState("error");
    }
  }

  async function handleConvertToPdf() {
    if (!selectedFilePath || !openModal) return;

    setConversionState("converting");
    setError(null);

    try {
      const commandMap = {
        md: "convert_md_to_pdf",
        docx: "convert_docx_to_pdf",
        pptx: "convert_pptx_to_pdf",
      };

      const command = commandMap[openModal];

      const outputPath = await invoke<string>(command, {
        filePath: selectedFilePath,
      });

      setConversionState("success");
      setSuccessPath(outputPath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setConversionState("error");
    }
  }

  function handleCloseModal() {
    setOpenModal(null);
    setSelectedFilePath(null);
    setSelectedFileName(null);
    setConversionState("idle");
    setError(null);
    setSuccessPath(null);
  }

  function handleReset() {
    setSelectedFilePath(null);
    setSelectedFileName(null);
    setConversionState("idle");
    setError(null);
    setSuccessPath(null);
  }

  const currentConfig = openModal ? fileConfigs[openModal] : null;

  return (
    <main className="relative min-h-screen bg-surface">
      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.04]" />

      {/* Top border line */}
      <div className="fixed inset-x-0 top-0 z-40 h-1 bg-ink" />

      {/* Theme toggle - top right corner */}
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        {/* ====== HEADER ====== */}
        <header className="mb-20">
          {/* Tagline banner */}
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-3 border-2 border-ink bg-surface-raised px-4 py-2.5 shadow-hard">
              <Shield className="h-4 w-4 text-ink" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted">
                100% Local &middot; No Upload &middot; Privacy First
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="animate-slide-up stagger-2">
            <h1
              className="font-display text-7xl font-black text-ink leading-[0.85] tracking-tighter md:text-9xl"
              style={{
                fontVariationSettings: '"SOFT" 50, "WONK" 1',
              }}
            >
              i own
              <br />
              <span className="text-outline">pdf</span>
            </h1>
          </div>

          {/* Subtitle + accent line */}
          <div className="mt-8 animate-slide-up stagger-3">
            <div className="flex items-start gap-6">
              <div className="h-12 w-1.5 bg-ink shrink-0" />
              <p className="max-w-lg text-base text-ink-muted leading-relaxed">
                Convert your documents to PDF with precision.
                <br />
                Fast, private, and completely local — your files
                <br />
                never leave your machine.
              </p>
            </div>
          </div>
        </header>

        {/* ====== CONVERSION CARDS ====== */}
        <section className="mb-20">
          {/* Section header */}
          <div className="mb-8 flex items-end gap-4">
            <h2 className="font-display text-3xl font-bold text-ink tracking-tight">
              Convert to PDF
            </h2>
            <div className="flex-1 border-b-2 border-border" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-faint pb-1">
              01 / Input
            </span>
          </div>

          {/* Cards grid — asymmetric: first card spans 2 cols on md */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="animate-slide-up stagger-4">
              <ConvertButton
                icon={FileText}
                label="Markdown"
                description={fileConfigs.md.descriptionText}
                onClick={() => setOpenModal("md")}
                accentColor={fileConfigs.md.accentColor}
                accentBg={fileConfigs.md.accentBg}
              />
            </div>
            <div className="animate-slide-up stagger-5">
              <ConvertButton
                icon={Presentation}
                label="PowerPoint"
                description={fileConfigs.pptx.descriptionText}
                onClick={() => setOpenModal("pptx")}
                accentColor={fileConfigs.pptx.accentColor}
                accentBg={fileConfigs.pptx.accentBg}
              />
            </div>
            <div className="animate-slide-up stagger-6">
              <ConvertButton
                icon={FileEdit}
                label="Word"
                description={fileConfigs.docx.descriptionText}
                onClick={() => setOpenModal("docx")}
                accentColor={fileConfigs.docx.accentColor}
                accentBg={fileConfigs.docx.accentBg}
              />
            </div>
          </div>
        </section>

        {/* ====== COMING SOON ====== */}
        <section className="mb-20">
          <div className="mb-8 flex items-end gap-4">
            <h2 className="font-display text-3xl font-bold text-ink tracking-tight">
              Reverse
            </h2>
            <div className="flex-1 border-b-2 border-border" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-faint pb-1">
              02 / Output
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {comingSoonConfigs.map((config, i) => (
              <div
                key={config.label}
                className={`animate-slide-up`}
                style={{ animationDelay: `${0.5 + i * 0.08}s` }}
              >
                <ComingSoonCard
                  icon={config.icon}
                  label={config.label}
                  description={config.description}
                  accentColor={config.accentColor}
                  accentBg={config.accentBg}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ====== FOOTER ====== */}
        <footer className="border-t-2 border-border pt-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-ink-faint" />
              <span className="font-mono text-xs text-ink-faint">
                Built with Rust &amp; React
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                v0.1.0
              </span>
              <div className="h-3 w-3 border-2 border-ink-faint bg-ink-faint" />
            </div>
          </div>
        </footer>
      </div>

      {/* ====== MODAL ====== */}
      {currentConfig && (
        <Modal
          isOpen={!!openModal}
          onClose={handleCloseModal}
          title={currentConfig.title}
          accentColor={currentConfig.accentColor}
          accentBg={currentConfig.accentBg}
        >
          {conversionState === "success" && successPath ? (
            <div className="space-y-6">
              <div
                className="border-2 border-ink p-6"
                style={{ backgroundColor: currentConfig.accentBg }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-surface-raised shrink-0">
                    <CheckCircle2
                      className="h-6 w-6"
                      style={{ color: currentConfig.accentColor }}
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      Conversion Successful
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">
                      PDF saved alongside your original file
                    </p>
                    <div className="mt-3 border-t border-border pt-3">
                      <p className="font-mono text-xs text-ink-muted break-all">
                        {successPath}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn-sharp flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm"
              >
                <span>Close</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : conversionState === "converting" ? (
            <div className="flex flex-col items-center border-2 border-ink p-10 text-center bg-surface-depressed">
              <div className="relative mb-6">
                <Loader2 className="h-16 w-16 animate-spin text-ink" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">
                Converting...
              </h3>
              <p className="mt-2 text-sm text-ink-muted">
                This may take a moment
              </p>
              {selectedFilePath && (
                <div className="mt-6 w-full border-t border-border pt-4">
                  <p className="font-mono text-xs text-ink-muted truncate">
                    {selectedFileName}
                  </p>
                  <div className="mt-3 h-1.5 w-full bg-border overflow-hidden">
                    <div
                      className="h-full animate-pulse"
                      style={{
                        width: "66%",
                        backgroundColor: currentConfig.accentColor,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* File picker button */}
              <button
                type="button"
                onClick={handlePickFile}
                className="btn-sharp group flex w-full flex-col items-center justify-center p-10"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center border-2 border-dashed border-ink-faint transition-colors group-hover:border-ink">
                  <currentConfig.icon className="h-7 w-7 text-ink-faint transition-colors group-hover:text-ink" />
                </div>
                <p className="font-display text-lg font-bold text-ink">
                  {currentConfig.label}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  {currentConfig.description}
                </p>
              </button>

              {/* Selected file info */}
              {selectedFilePath && (
                <div className="animate-scale-in">
                  {conversionState === "error" && error && (
                    <div className="mb-4 border-2 border-red-700 bg-red-50 p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
                        <div>
                          <p className="text-sm font-bold text-red-900">
                            Conversion Failed
                          </p>
                          <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 border-2 border-ink p-4 bg-surface-depressed">
                    <div
                      className="flex h-10 w-10 items-center justify-center border-2 border-ink shrink-0"
                      style={{ backgroundColor: currentConfig.accentBg }}
                    >
                      <currentConfig.icon
                        className="h-5 w-5"
                        style={{ color: currentConfig.accentColor }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">
                        {selectedFileName}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                        Ready
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex h-8 w-8 items-center justify-center border-2 border-border bg-surface-raised transition-colors hover:border-red-500 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 text-ink-faint hover:text-red-600" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleConvertToPdf}
                    className="btn-sharp mt-4 flex w-full items-center justify-center gap-2 px-4 py-4 text-sm text-white"
                    style={{
                      backgroundColor: currentConfig.accentColor,
                      borderColor: "var(--color-ink)",
                    }}
                  >
                    <span>Convert to PDF</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </Modal>
      )}
    </main>
  );
}
