import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	accentColor?: string;
	accentBg?: string;
}

export function Modal({
	isOpen,
	onClose,
	title,
	children,
	accentColor = "var(--color-accent-blue)",
	accentBg = "var(--color-accent-blue-subtle)",
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
			{/* Backdrop */}
			{/* biome-ignore lint/a11y/useSemanticElements: Backdrop overlay needs div element */}
			<div
				role="button"
				tabIndex={0}
				className="modal-backdrop fixed inset-0"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onClose();
					}
				}}
			/>

			{/* Modal panel */}
			<div className="relative z-50 w-full max-w-lg animate-scale-in">
				<div className="modal-panel">
					{/* Header */}
					<div className="flex items-center justify-between border-b-2 border-ink px-7 py-5">
						<div className="flex items-center gap-4">
							{/* Accent square */}
							<div
								className="flex h-8 w-8 items-center justify-center border-2 border-ink"
								style={{ backgroundColor: accentBg }}
							>
								<div
									className="h-3 w-3 border border-ink"
									style={{ backgroundColor: accentColor }}
								/>
							</div>
							<h2 className="font-display text-2xl font-bold text-ink tracking-tight">
								{title}
							</h2>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-surface-raised transition-all duration-150 hover:bg-ink"
						>
							<X className="h-4 w-4 text-ink transition-colors duration-150 hover:text-surface-raised" />
						</button>
					</div>

					{/* Body */}
					<div className="px-7 py-7">{children}</div>

					{/* Bottom accent bar */}
					<div className="h-1.5 w-full" style={{ backgroundColor: accentBg }} />
				</div>
			</div>
		</div>
	);
}
