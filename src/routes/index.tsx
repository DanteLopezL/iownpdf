import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
	AlertTriangle,
	ArrowRight,
	CheckCircle2,
	Clock,
	FileEdit,
	FileText,
	FolderOpen,
	Loader2,
	Presentation,
	Shield,
	XCircle,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BatchModal } from "#/components/BatchModal";
import { ComingSoonCard } from "#/components/ComingSoonCard";
import { ConvertButton } from "#/components/ConvertButton";
import { Modal } from "#/components/Modal";
import {
	type RecentFileType,
	usePreferences,
} from "#/context/PreferencesContext";

export const Route = createFileRoute("/")({ component: App });

type FileType = "md" | "pptx" | "docx" | null;
type ConversionState =
	| "idle"
	| "confirm-overwrite"
	| "converting"
	| "success"
	| "error";

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

function inferFileType(path: string): FileType {
	const ext = path.split(".").pop()?.toLowerCase() ?? "";
	if (ext === "md" || ext === "markdown") return "md";
	if (ext === "docx") return "docx";
	if (ext === "pptx") return "pptx";
	return null;
}

function basename(path: string): string {
	return path.split(/[\\/]/).pop() || path;
}

function predictOutputPath(filePath: string, outputDir: string | null): string {
	const sep = filePath.includes("\\") ? "\\" : "/";
	const lastSlash = Math.max(
		filePath.lastIndexOf("/"),
		filePath.lastIndexOf("\\"),
	);
	const dir = lastSlash >= 0 ? filePath.slice(0, lastSlash) : "";
	const fileName = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;
	const dotIdx = fileName.lastIndexOf(".");
	const stem = dotIdx > 0 ? fileName.slice(0, dotIdx) : fileName;
	const targetDir = outputDir ?? dir;
	return `${targetDir}${sep}${stem}.pdf`;
}

function App() {
	const { prefs, addRecentFile } = usePreferences();
	const [openModal, setOpenModal] = useState<FileType>(null);
	const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
	const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
	const [conversionState, setConversionState] =
		useState<ConversionState>("idle");
	const [error, setError] = useState<string | null>(null);
	const [successPath, setSuccessPath] = useState<string | null>(null);
	const [overwritePath, setOverwritePath] = useState<string | null>(null);
	const [outputDir, setOutputDir] = useState<string | null>(null);
	const [batchFiles, setBatchFiles] = useState<string[]>([]);
	const [isBatchOpen, setIsBatchOpen] = useState(false);

	const effectiveOutputDir = outputDir ?? prefs.defaultOutputDir;

	async function pickOutputDir(): Promise<string | null> {
		try {
			const dir = await invoke<string | null>("pick_folder");
			return dir ?? null;
		} catch (err) {
			console.error("pick_folder failed", err);
			return null;
		}
	}

	async function handlePickOutputDir() {
		const dir = await pickOutputDir();
		if (dir) setOutputDir(dir);
	}

	async function handleRevealOutput() {
		if (!successPath) return;
		try {
			await invoke("reveal_in_folder", { path: successPath });
		} catch (err) {
			console.error("reveal_in_folder failed", err);
		}
	}

	async function handlePickFile() {
		if (!openModal) return;

		try {
			const filePath = await invoke<string | null>("pick_file", {
				fileType: openModal,
			});

			if (!filePath) return;

			setSelectedFilePath(filePath);
			setSelectedFileName(basename(filePath));
			setConversionState("idle");
			setError(null);
			setSuccessPath(null);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			setError(errorMessage);
			setConversionState("error");
		}
	}

	function selectRecentFile(path: string) {
		setSelectedFilePath(path);
		setSelectedFileName(basename(path));
		setConversionState("idle");
		setError(null);
		setSuccessPath(null);
	}

	async function runConversion() {
		if (!selectedFilePath || !openModal) return;

		setConversionState("converting");
		setError(null);

		try {
			const outputPath = await invoke<string>("convert_to_pdf", {
				filePath: selectedFilePath,
				fileType: openModal,
				outputDir: effectiveOutputDir,
			});

			addRecentFile(openModal as RecentFileType, selectedFilePath);
			setConversionState("success");
			setSuccessPath(outputPath);

			if (prefs.openFolderAfterConvert) {
				try {
					await invoke("reveal_in_folder", { path: outputPath });
				} catch (err) {
					console.error("reveal_in_folder failed", err);
				}
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			setError(errorMessage);
			setConversionState("error");
		}
	}

	async function handleConvertToPdf() {
		if (!selectedFilePath || !openModal) return;

		if (prefs.confirmBeforeOverwrite) {
			const predicted = predictOutputPath(selectedFilePath, effectiveOutputDir);
			try {
				const exists = await invoke<boolean>("path_exists", {
					path: predicted,
				});
				if (exists) {
					setOverwritePath(predicted);
					setConversionState("confirm-overwrite");
					return;
				}
			} catch (err) {
				console.error("path_exists failed", err);
			}
		}

		await runConversion();
	}

	async function handleConfirmOverwrite() {
		setOverwritePath(null);
		await runConversion();
	}

	function handleCancelOverwrite() {
		setOverwritePath(null);
		setConversionState("idle");
	}

	function handleCloseModal() {
		setOpenModal(null);
		setSelectedFilePath(null);
		setSelectedFileName(null);
		setConversionState("idle");
		setError(null);
		setSuccessPath(null);
		setOverwritePath(null);
	}

	function handleReset() {
		setSelectedFilePath(null);
		setSelectedFileName(null);
		setConversionState("idle");
		setError(null);
		setSuccessPath(null);
		setOverwritePath(null);
	}

	function handleCloseBatch() {
		setIsBatchOpen(false);
		setBatchFiles([]);
	}

	useEffect(() => {
		let unlisten: (() => void) | null = null;
		let cancelled = false;

		getCurrentWindow()
			.onDragDropEvent((event) => {
				if (event.payload.type !== "drop") return;
				const paths = event.payload.paths;
				if (paths.length === 0) return;

				// Single supported file → open the type-specific modal pre-populated.
				if (paths.length === 1) {
					const path = paths[0];
					const kind = inferFileType(path);
					if (!kind) return;
					setOpenModal(kind);
					setSelectedFilePath(path);
					setSelectedFileName(basename(path));
					setConversionState("idle");
					setError(null);
					setSuccessPath(null);
					return;
				}

				// Multiple files → batch modal with only supported ones.
				const supported = paths.filter((p) => inferFileType(p) !== null);
				if (supported.length === 0) return;
				setBatchFiles(supported);
				setIsBatchOpen(true);
			})
			.then((u) => {
				if (cancelled) {
					u();
					return;
				}
				unlisten = u;
			});

		return () => {
			cancelled = true;
			unlisten?.();
		};
	}, []);

	const currentConfig = openModal ? fileConfigs[openModal] : null;
	const recentForType =
		openModal &&
		(openModal === "md" || openModal === "docx" || openModal === "pptx")
			? prefs.recentFiles[openModal]
			: [];

	return (
		<main className="relative min-h-screen bg-surface">
			{/* Grid pattern overlay */}
			<div className="pointer-events-none absolute inset-0 grid-pattern opacity-[0.04]" />

			{/* Spacer for custom title bar */}
			<div className="h-11" />

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
					<div className="mb-4 flex items-end gap-4">
						<h2 className="font-display text-3xl font-bold text-ink tracking-tight">
							Convert to PDF
						</h2>
						<div className="flex-1 border-b-2 border-border" />
						<span className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-faint pb-1">
							01 / Input
						</span>
					</div>

					{/* Drop hint */}
					<p className="mb-8 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
						Tip &middot; drop files anywhere to start a single or batch convert
					</p>

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
								v0.2.0
							</span>
							<div className="h-3 w-3 border-2 border-ink-faint bg-ink-faint" />
						</div>
					</div>
				</footer>
			</div>

			{/* ====== BATCH MODAL ====== */}
			<BatchModal
				isOpen={isBatchOpen}
				onClose={handleCloseBatch}
				files={batchFiles}
				outputDir={effectiveOutputDir}
				onPickOutputDir={pickOutputDir}
			/>

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
											{effectiveOutputDir
												? "PDF saved to your chosen folder"
												: "PDF saved alongside your original file"}
										</p>
										<div className="mt-3 border-t border-border pt-3">
											<p className="font-mono text-xs text-ink-muted break-all">
												{successPath}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={handleRevealOutput}
									className="btn-sharp flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm"
								>
									<FolderOpen className="h-4 w-4" />
									<span>Open folder</span>
								</button>
								<button
									type="button"
									onClick={handleCloseModal}
									className="btn-sharp flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm"
								>
									<span>Close</span>
									<ArrowRight className="h-4 w-4" />
								</button>
							</div>
						</div>
					) : conversionState === "confirm-overwrite" && overwritePath ? (
						<div className="space-y-5">
							<div className="border-2 border-ink bg-yellow-50 p-5">
								<div className="flex items-start gap-4">
									<div className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-yellow-200 shrink-0">
										<AlertTriangle className="h-5 w-5 text-ink" />
									</div>
									<div className="min-w-0 flex-1">
										<h3 className="font-display text-base font-bold text-ink">
											File already exists
										</h3>
										<p className="mt-1 text-sm text-ink-muted">
											A PDF with the same name already exists at this path.
											Continuing will replace it.
										</p>
										<div className="mt-3 border-t border-border pt-3">
											<p className="font-mono text-xs text-ink-muted break-all">
												{overwritePath}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={handleCancelOverwrite}
									className="btn-sharp flex-1 px-4 py-3.5 text-sm"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleConfirmOverwrite}
									className="btn-sharp flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm text-white"
									style={{
										backgroundColor: currentConfig.accentColor,
										borderColor: "var(--color-ink)",
									}}
								>
									<span>Overwrite</span>
									<ArrowRight className="h-4 w-4" />
								</button>
							</div>
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
							{/* Output folder control */}
							<div className="border-2 border-ink bg-surface-depressed p-4">
								<div className="flex items-center justify-between gap-3">
									<div className="min-w-0 flex-1">
										<p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
											Output folder
											{!outputDir && prefs.defaultOutputDir && (
												<span className="ml-2 text-ink-faint normal-case">
													(default)
												</span>
											)}
										</p>
										<p className="mt-1 truncate text-sm text-ink">
											{effectiveOutputDir ?? "Alongside the input file"}
										</p>
									</div>
									<button
										type="button"
										onClick={handlePickOutputDir}
										className="flex items-center gap-2 border-2 border-ink bg-surface-raised px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-surface-raised"
									>
										<FolderOpen className="h-3.5 w-3.5" />
										{effectiveOutputDir ? "Change" : "Choose"}
									</button>
								</div>
							</div>

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

							{/* Recent files */}
							{!selectedFilePath && recentForType.length > 0 && (
								<div className="border-2 border-ink bg-surface-depressed">
									<div className="flex items-center gap-2 border-b-2 border-ink px-4 py-2.5">
										<Clock className="h-3.5 w-3.5 text-ink-faint" />
										<span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">
											Recent
										</span>
									</div>
									<ul>
										{recentForType.map((path, idx) => (
											<li
												key={path}
												className={
													idx !== recentForType.length - 1
														? "border-b border-border"
														: ""
												}
											>
												<button
													type="button"
													onClick={() => selectRecentFile(path)}
													className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-raised"
												>
													<currentConfig.icon
														className="h-4 w-4 shrink-0"
														style={{ color: currentConfig.accentColor }}
													/>
													<div className="min-w-0 flex-1">
														<p className="truncate text-sm font-bold text-ink">
															{basename(path)}
														</p>
														<p className="truncate font-mono text-[10px] text-ink-faint">
															{path}
														</p>
													</div>
												</button>
											</li>
										))}
									</ul>
								</div>
							)}

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
