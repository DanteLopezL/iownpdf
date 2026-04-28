import { invoke } from "@tauri-apps/api/core";
import { FolderOpen, Moon, Sun, Trash2, X } from "lucide-react";
import { Modal } from "#/components/Modal";
import { usePreferences } from "#/context/PreferencesContext";

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface ToggleProps {
	id: string;
	label: string;
	description: string;
	checked: boolean;
	onChange: (value: boolean) => void;
}

function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
	return (
		<label
			htmlFor={id}
			className="flex cursor-pointer items-start justify-between gap-4 border-2 border-ink bg-surface-depressed p-4 transition-colors hover:bg-surface-raised"
		>
			<div className="min-w-0 flex-1">
				<p className="font-display text-sm font-bold text-ink">{label}</p>
				<p className="mt-1 text-xs text-ink-muted leading-relaxed">
					{description}
				</p>
			</div>
			<div className="relative shrink-0 pt-1">
				<input
					id={id}
					type="checkbox"
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					className="peer sr-only"
				/>
				<div
					className="h-6 w-11 border-2 border-ink bg-surface-raised transition-colors peer-checked:bg-ink"
					aria-hidden="true"
				/>
				<div
					className="absolute left-0.5 top-1.5 h-4 w-4 border-2 border-ink bg-surface-raised transition-transform peer-checked:translate-x-5 peer-checked:bg-surface-raised"
					aria-hidden="true"
				/>
			</div>
		</label>
	);
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
	const {
		prefs,
		setTheme,
		setDefaultOutputDir,
		setOpenFolderAfterConvert,
		setConfirmBeforeOverwrite,
		clearRecentFiles,
	} = usePreferences();

	async function handlePickDefaultDir() {
		try {
			const dir = await invoke<string | null>("pick_folder");
			if (dir) setDefaultOutputDir(dir);
		} catch (err) {
			console.error("pick_folder failed", err);
		}
	}

	const totalRecent =
		prefs.recentFiles.md.length +
		prefs.recentFiles.docx.length +
		prefs.recentFiles.pptx.length;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Settings">
			<div className="space-y-6">
				{/* Theme */}
				<section>
					<p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
						Appearance
					</p>
					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={() => setTheme("light")}
							className={`flex items-center gap-3 border-2 border-ink p-4 transition-colors ${
								prefs.theme === "light"
									? "bg-ink text-surface-raised"
									: "bg-surface-raised hover:bg-surface-depressed"
							}`}
						>
							<Sun className="h-4 w-4" />
							<span className="font-display text-sm font-bold">Light</span>
						</button>
						<button
							type="button"
							onClick={() => setTheme("dark")}
							className={`flex items-center gap-3 border-2 border-ink p-4 transition-colors ${
								prefs.theme === "dark"
									? "bg-ink text-surface-raised"
									: "bg-surface-raised hover:bg-surface-depressed"
							}`}
						>
							<Moon className="h-4 w-4" />
							<span className="font-display text-sm font-bold">Dark</span>
						</button>
					</div>
				</section>

				{/* Default output folder */}
				<section>
					<p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
						Default output folder
					</p>
					<div className="border-2 border-ink bg-surface-depressed p-4">
						<div className="flex items-center justify-between gap-3">
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm text-ink">
									{prefs.defaultOutputDir ?? "Alongside each input file"}
								</p>
								<p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
									{prefs.defaultOutputDir
										? "Pre-fills every conversion"
										: "No default set"}
								</p>
							</div>
							<div className="flex items-center gap-2">
								{prefs.defaultOutputDir && (
									<button
										type="button"
										onClick={() => setDefaultOutputDir(null)}
										className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-surface-raised transition-colors hover:bg-red-50 hover:border-red-500"
										aria-label="Clear default output folder"
									>
										<X className="h-3.5 w-3.5" />
									</button>
								)}
								<button
									type="button"
									onClick={handlePickDefaultDir}
									className="flex items-center gap-2 border-2 border-ink bg-surface-raised px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-surface-raised"
								>
									<FolderOpen className="h-3.5 w-3.5" />
									{prefs.defaultOutputDir ? "Change" : "Choose"}
								</button>
							</div>
						</div>
					</div>
				</section>

				{/* Toggles */}
				<section className="space-y-3">
					<p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
						Behavior
					</p>
					<Toggle
						id="open-folder-after"
						label="Open folder after convert"
						description="Reveal the resulting PDF in your file manager when conversion completes."
						checked={prefs.openFolderAfterConvert}
						onChange={setOpenFolderAfterConvert}
					/>
					<Toggle
						id="confirm-overwrite"
						label="Confirm before overwrite"
						description="Ask before replacing an existing PDF with the same name."
						checked={prefs.confirmBeforeOverwrite}
						onChange={setConfirmBeforeOverwrite}
					/>
				</section>

				{/* Recent files */}
				<section>
					<p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
						Recent files
					</p>
					<div className="border-2 border-ink bg-surface-depressed p-4">
						<div className="flex items-center justify-between gap-3">
							<div>
								<p className="font-display text-sm font-bold text-ink">
									{totalRecent} remembered
								</p>
								<p className="mt-1 text-xs text-ink-muted">
									Quick-access list shown in each conversion modal.
								</p>
							</div>
							<button
								type="button"
								onClick={() => clearRecentFiles()}
								disabled={totalRecent === 0}
								className="flex items-center gap-2 border-2 border-ink bg-surface-raised px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-red-50 hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
							>
								<Trash2 className="h-3.5 w-3.5" />
								Clear
							</button>
						</div>
					</div>
				</section>
			</div>
		</Modal>
	);
}
