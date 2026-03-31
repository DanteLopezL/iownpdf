import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* biome-ignore lint/a11y/useSemanticElements: Backdrop overlay needs div element */}
			<div
				role="button"
				tabIndex={0}
				className="fixed inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						onClose();
					}
				}}
			/>
			<div className="relative z-50 w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-gray-900">{title}</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<div className="mt-4">{children}</div>
			</div>
		</div>
	);
}
