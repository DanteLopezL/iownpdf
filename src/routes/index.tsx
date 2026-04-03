import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  FileEdit,
  FileText,
  Loader2,
  Presentation,
  Shield,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { ConvertButton } from "#/components/ConvertButton";
import { Modal } from "#/components/Modal";

export const Route = createFileRoute("/")({ component: App });

type FileType = "md" | "pptx" | "docx" | null;
type ConversionState = "idle" | "converting" | "success" | "error";

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

      if (!filePath) return; // User cancelled

      // Extract file name from path
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

      // Call Rust conversion - PDF will be generated in same path
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

  const fileConfigs = {
    md: {
      label: "Select a Markdown file",
      description: "Only .md and .markdown files are allowed",
      title: "Convert Markdown",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      shadowColor: "shadow-blue-200/50",
      descriptionText: "Convert Markdown to PDF",
    },
    pptx: {
      label: "Select a PowerPoint file",
      description: "Only .pptx files are allowed",
      title: "Convert PowerPoint",
      icon: Presentation,
      gradient: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
      shadowColor: "shadow-orange-200/50",
      descriptionText: "Convert PowerPoint to PDF",
    },
    docx: {
      label: "Select a Word file",
      description: "Only .docx files are allowed",
      title: "Convert Word",
      icon: FileEdit,
      gradient: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      shadowColor: "shadow-indigo-200/50",
      descriptionText: "Convert Word to PDF",
    },
  };

  const currentConfig = openModal ? fileConfigs[openModal] : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-linear-to-br from-blue-400/20 to-purple-400/20 blur-3xl animate-pulse" />
        <div
          className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-linear-to-br from-cyan-400/20 to-blue-400/20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-linear-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 px-5 py-2.5 text-sm font-medium text-slate-600 shadow-lg backdrop-blur-sm ring-1 ring-slate-200/50">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>Free & Private Document Conversion</span>
          </div>
          <h1 className="bg-linear-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent md:text-7xl lg:text-8xl">
            i own pdf
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Convert your documents to PDF with ease. Fast, private, and
            completely local.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-14 flex items-center justify-center gap-10 text-sm text-slate-600">
          <div className="flex items-center gap-2.5 rounded-full bg-white/60 px-4 py-2 shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm">
            <div className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-200/50" />
            <span className="font-medium">100% Local</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-full bg-white/60 px-4 py-2 shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm">
            <div className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-200/50" />
            <span className="font-medium">No Upload</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-full bg-white/60 px-4 py-2 shadow-md ring-1 ring-slate-200/50 backdrop-blur-sm">
            <div className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-purple-400 to-pink-500 shadow-lg shadow-purple-200/50" />
            <span className="font-medium">Privacy First</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-8 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Shield className="h-4 w-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Zap className="h-4 w-4" />
            <span>Fast</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Coins className="h-4 w-4" />
            <span>Free Forever</span>
          </div>
        </div>

        {/* Conversion Cards */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ConvertButton
            icon={FileText}
            label="Markdown"
            description={fileConfigs.md.descriptionText}
            onClick={() => setOpenModal("md")}
            gradient={fileConfigs.md.gradient}
            bgColor={fileConfigs.md.bgColor}
            textColor={fileConfigs.md.textColor}
          />
          <ConvertButton
            icon={Presentation}
            label="PowerPoint"
            description={fileConfigs.pptx.descriptionText}
            onClick={() => setOpenModal("pptx")}
            gradient={fileConfigs.pptx.gradient}
            bgColor={fileConfigs.pptx.bgColor}
            textColor={fileConfigs.pptx.textColor}
          />
          <ConvertButton
            icon={FileEdit}
            label="Word"
            description={fileConfigs.docx.descriptionText}
            onClick={() => setOpenModal("docx")}
            gradient={fileConfigs.docx.gradient}
            bgColor={fileConfigs.docx.bgColor}
            textColor={fileConfigs.docx.textColor}
          />
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Built with ❤️ using Rust & React
          </p>
        </div>
      </div>

      {/* Modal */}
      {currentConfig && (
        <Modal
          isOpen={!!openModal}
          onClose={handleCloseModal}
          title={currentConfig.title}
          gradient={currentConfig.gradient}
        >
          {conversionState === "success" && successPath ? (
            <div className="space-y-6">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div
                  className={`rounded-2xl border ${currentConfig.borderColor} ${currentConfig.bgColor} p-6 shadow-lg`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r ${currentConfig.gradient} shadow-xl`}
                    >
                      <CheckCircle2 className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Conversion Successful!
                      </h3>
                      <p className="text-sm text-slate-600">
                        PDF saved to the same location as your original file
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {successPath}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="group w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  Close
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </div>
          ) : conversionState === "converting" ? (
            <div className="space-y-6">
              <div className="animate-in fade-in duration-300">
                <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-8 shadow-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      {/* Pulsing Ring */}
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                      <Loader2 className="relative h-20 w-20 animate-spin text-blue-600" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <currentConfig.icon className="h-8 w-8 text-slate-400" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">
                      Converting your file...
                    </h3>
                    <p className="text-sm text-slate-600">
                      This may take a moment
                    </p>
                    {selectedFilePath && (
                      <div className="mt-6 w-full rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
                        <p className="truncate text-sm font-medium text-slate-700">
                          {selectedFileName}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full w-2/3 animate-pulse rounded-full bg-linear-to-r from-blue-500 to-purple-500" />
                          </div>
                          <span className="text-xs font-medium text-slate-500">
                            Processing...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                type="button"
                onClick={handlePickFile}
                className="group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 p-10 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-lg"
              >
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-400 transition-all duration-300 group-hover:from-slate-200 group-hover:to-slate-300 group-hover:text-slate-500 group-hover:shadow-lg">
                    <currentConfig.icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <p className="text-base font-semibold text-slate-900">
                    {currentConfig.label}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {currentConfig.description}
                  </p>
                </div>
              </button>

              {selectedFilePath && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {conversionState === "error" && error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-linear-to-r from-red-50 to-red-100/50 p-5 shadow-sm">
                      <div className="flex gap-3">
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                        <div>
                          <p className="text-sm font-bold text-red-900">
                            Conversion Failed
                          </p>
                          <p className="mt-1.5 text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 rounded-xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-5 shadow-md">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r ${currentConfig.gradient} shadow-lg`}
                      >
                        <currentConfig.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {selectedFileName}
                        </p>
                        <p className="text-xs text-slate-500">
                          Ready to convert
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConvertToPdf}
                    className={`group flex w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r ${currentConfig.gradient} px-4 py-4 text-sm font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <span>Convert to PDF</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
