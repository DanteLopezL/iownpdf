import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Moon, Square, Sun, X } from "lucide-react";
import { useTheme } from "#/context/ThemeContext";

export function CustomTitleBar() {
	const { theme, toggleTheme } = useTheme();
	const appWindow = getCurrentWindow();

	async function handleMinimize() {
		await appWindow.minimize();
	}

	async function handleMaximize() {
		const isMaximized = await appWindow.isMaximized();
		if (isMaximized) {
			await appWindow.unmaximize();
		} else {
			await appWindow.maximize();
		}
	}

	async function handleClose() {
		await appWindow.close();
	}

	return (
		<div
			className="fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between border-b-2 border-ink bg-surface-raised select-none"
			data-tauri-drag-region
		>
			{/* Left: App title + accent block */}
			<div className="flex items-center gap-3 pl-4">
				<div className="flex h-5 w-5 items-center justify-center border-2 border-ink bg-ink">
					<span className="font-display text-[8px] font-black text-surface">
						i
					</span>
				</div>
				<span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-muted">
					i own pdf
				</span>
			</div>

			{/* Right: Theme toggle + Window controls */}
			<div className="flex items-center">
				{/* Theme toggle — smaller, integrated */}
				<button
					type="button"
					onClick={toggleTheme}
					className="flex h-11 w-11 cursor-pointer items-center justify-center border-l-2 border-ink transition-colors hover:bg-ink hover:text-surface-raised"
					aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
				>
					{theme === "light" ? (
						<Moon className="h-4 w-4" />
					) : (
						<Sun className="h-4 w-4" />
					)}
				</button>

				{/* Minimize */}
				<button
					type="button"
					onClick={handleMinimize}
					className="flex h-11 w-12 cursor-pointer items-center justify-center border-l-2 border-ink transition-colors hover:bg-ink hover:text-surface-raised"
					aria-label="Minimize"
				>
					<Minus className="h-3.5 w-3.5" />
				</button>

				{/* Maximize / Restore */}
				<button
					type="button"
					onClick={handleMaximize}
					className="flex h-11 w-12 cursor-pointer items-center justify-center border-l-2 border-ink transition-colors hover:bg-ink hover:text-surface-raised"
					aria-label="Maximize"
				>
					<Square className="h-3.5 w-3.5" />
				</button>

				{/* Close */}
				<button
					type="button"
					onClick={handleClose}
					className="flex h-11 w-12 cursor-pointer items-center justify-center border-l-2 border-ink border-r-0 transition-colors hover:bg-red-600 hover:text-white hover:border-red-600"
					aria-label="Close"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
