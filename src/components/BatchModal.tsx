import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import {
	ArrowRight,
	CheckCircle2,
	FolderOpen,
	Loader2,
	XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Modal } from "#/components/Modal";

type ItemStatus = "pending" | "success" | "error";

interface BatchItem {
	filePath: string;
	fileName: string;
	status: ItemStatus;
	outputPath?: string;
	error?: string;
}

interface BatchProgressPayload {
	index: number;
	total: number;
	item:
		| { status: "success"; file_path: string; output_path: string }
		| { status: "error"; file_path: string; error: string };
}

interface BatchModalProps {
	isOpen: boolean;
	onClose: () => void;
	files: string[];
	outputDir: string | null;
	onPickOutputDir: () => Promise<string | null>;
}

function basename(path: string): string {
	const parts = path.split(/[\\/]/);
	return parts[parts.length - 1] || path;
}

export function BatchModal({
	isOpen,
	onClose,
	files,
	outputDir,
	onPickOutputDir,
}: BatchModalProps) {
	const [items, setItems] = useState<BatchItem[]>([]);
	const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
	const [localOutputDir, setLocalOutputDir] = useState<string | null>(
		outputDir,
	);
	const unlistenRef = useRef<UnlistenFn | null>(null);

	useEffect(() => {
		if (!isOpen) return;
		setItems(
			files.map((f) => ({
				filePath: f,
				fileName: basename(f),
				status: "pending",
			})),
		);
		setPhase("idle");
		setLocalOutputDir(outputDir);
	}, [isOpen, files, outputDir]);

	useEffect(() => {
		if (!isOpen) return;

		let cancelled = false;
		listen<BatchProgressPayload>("batch-progress", (event) => {
			if (cancelled) return;
			const { item } = event.payload;
			setItems((prev) =>
				prev.map((row) => {
					if (row.filePath !== item.file_path) return row;
					if (item.status === "success") {
						return {
							...row,
							status: "success",
							outputPath: item.output_path,
						};
					}
					return {
						...row,
						status: "error",
						error: item.error,
					};
				}),
			);
		}).then((unlisten) => {
			if (cancelled) {
				unlisten();
				return;
			}
			unlistenRef.current = unlisten;
		});

		return () => {
			cancelled = true;
			unlistenRef.current?.();
			unlistenRef.current = null;
		};
	}, [isOpen]);

	async function handleRun() {
		setPhase("running");
		try {
			await invoke("batch_convert", {
				filePaths: files,
				outputDir: localOutputDir,
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			setItems((prev) =>
				prev.map((row) =>
					row.status === "pending"
						? { ...row, status: "error", error: message }
						: row,
				),
			);
		} finally {
			setPhase("done");
		}
	}

	async function handleChooseDir() {
		const picked = await onPickOutputDir();
		if (picked) setLocalOutputDir(picked);
	}

	async function handleRevealFirstOutput() {
		const firstOutput = items.find((i) => i.outputPath)?.outputPath;
		if (!firstOutput) return;
		try {
			await invoke("reveal_in_folder", { path: firstOutput });
		} catch (err) {
			console.error("reveal_in_folder failed", err);
		}
	}

	const successCount = items.filter((i) => i.status === "success").length;
	const errorCount = items.filter((i) => i.status === "error").length;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Batch convert (${files.length})`}
		>
			<div className="space-y-5">
				{/* Output folder control */}
				<div className="border-2 border-ink bg-surface-depressed p-4">
					<div className="flex items-center justify-between gap-3">
						<div className="min-w-0 flex-1">
							<p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
								Output folder
							</p>
							<p className="mt-1 truncate text-sm text-ink">
								{localOutputDir ?? "Alongside each input file"}
							</p>
						</div>
						<button
							type="button"
							onClick={handleChooseDir}
							disabled={phase === "running"}
							className="flex items-center gap-2 border-2 border-ink bg-surface-raised px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-surface-raised disabled:cursor-not-allowed disabled:opacity-50"
						>
							<FolderOpen className="h-3.5 w-3.5" />
							{localOutputDir ? "Change" : "Choose"}
						</button>
					</div>
				</div>

				{/* File list */}
				<div className="max-h-72 overflow-y-auto border-2 border-ink">
					<ul>
						{items.map((item, idx) => (
							<li
								key={item.filePath}
								className={`flex items-center gap-3 px-4 py-3 ${
									idx !== items.length - 1 ? "border-b border-border" : ""
								}`}
							>
								<div className="shrink-0">
									{item.status === "pending" &&
										(phase === "running" ? (
											<Loader2 className="h-4 w-4 animate-spin text-ink-muted" />
										) : (
											<div className="h-4 w-4 border-2 border-ink-faint" />
										))}
									{item.status === "success" && (
										<CheckCircle2 className="h-4 w-4 text-green-600" />
									)}
									{item.status === "error" && (
										<XCircle className="h-4 w-4 text-red-600" />
									)}
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-bold text-ink">
										{item.fileName}
									</p>
									{item.status === "error" && item.error && (
										<p className="mt-0.5 truncate text-xs text-red-700">
											{item.error}
										</p>
									)}
									{item.status === "success" && item.outputPath && (
										<p className="mt-0.5 truncate font-mono text-[10px] text-ink-faint">
											{item.outputPath}
										</p>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>

				{/* Summary / actions */}
				{phase === "done" && (
					<div className="border-2 border-ink bg-surface-depressed p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-display text-lg font-bold text-ink">
									{successCount} / {items.length} converted
								</p>
								{errorCount > 0 && (
									<p className="mt-1 text-sm text-red-700">
										{errorCount} failed
									</p>
								)}
							</div>
							{successCount > 0 && (
								<button
									type="button"
									onClick={handleRevealFirstOutput}
									className="flex items-center gap-2 border-2 border-ink bg-surface-raised px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-surface-raised"
								>
									<FolderOpen className="h-3.5 w-3.5" />
									Open folder
								</button>
							)}
						</div>
					</div>
				)}

				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={phase === "running"}
						className="btn-sharp flex-1 px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
					>
						{phase === "done" ? "Close" : "Cancel"}
					</button>
					{phase !== "done" && (
						<button
							type="button"
							onClick={handleRun}
							disabled={phase === "running" || files.length === 0}
							className="btn-sharp flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
							style={{
								backgroundColor: "var(--color-ink)",
								borderColor: "var(--color-ink)",
							}}
						>
							<span>
								{phase === "running" ? "Converting..." : "Convert all"}
							</span>
							{phase !== "running" && <ArrowRight className="h-4 w-4" />}
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
}
