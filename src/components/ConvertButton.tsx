import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface ConvertButtonProps {
	icon: LucideIcon;
	label: string;
	description: string;
	onClick: () => void;
	accentColor: string;
	accentBg: string;
}

export function ConvertButton({
	icon: Icon,
	label,
	description,
	onClick,
	accentColor,
	accentBg,
}: ConvertButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group relative flex w-full cursor-pointer flex-col items-start overflow-hidden border-2 border-ink bg-surface-raised text-left transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1"
			style={{
				boxShadow: "4px 4px 0px 0px var(--color-ink)",
			}}
			onMouseEnter={(e) => {
				(e.currentTarget.style as CSSStyleDeclaration).boxShadow =
					"6px 6px 0px 0px var(--color-ink)";
			}}
			onMouseLeave={(e) => {
				(e.currentTarget.style as CSSStyleDeclaration).boxShadow =
					"4px 4px 0px 0px var(--color-ink)";
			}}
			onMouseDown={(e) => {
				(e.currentTarget.style as CSSStyleDeclaration).boxShadow =
					"2px 2px 0px 0px var(--color-ink)";
				(e.currentTarget.style as CSSStyleDeclaration).transform =
					"translate(2px, 2px)";
			}}
			onMouseUp={(e) => {
				(e.currentTarget.style as CSSStyleDeclaration).boxShadow =
					"6px 6px 0px 0px var(--color-ink)";
				(e.currentTarget.style as CSSStyleDeclaration).transform =
					"translate(-2px, -2px)";
			}}
		>
			{/* Top accent bar */}
			<div
				className={`h-1.5 w-full ${accentBg} transition-all duration-300 group-hover:h-2`}
			/>

			{/* Icon block */}
			<div className="relative p-6 pb-0">
				<div
					className="flex h-14 w-14 items-center justify-center border-2 border-ink transition-transform duration-200 group-hover:scale-105"
					style={{ backgroundColor: accentBg }}
				>
					<Icon
						className="h-6 w-6 transition-colors duration-200"
						style={{ color: accentColor }}
					/>
				</div>
			</div>

			{/* Text content */}
			<div className="relative p-6 pt-5">
				<h3 className="font-display text-2xl font-bold text-ink leading-tight tracking-tight transition-colors duration-200">
					{label}
				</h3>
				<p className="mt-2 text-sm text-ink-muted leading-relaxed">
					{description}
				</p>
			</div>

			{/* Bottom action bar */}
			<div className="relative mt-auto flex w-full items-center justify-between border-t-2 border-ink px-6 py-4 bg-surface-depressed">
				<span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">
					Convert
				</span>
				<div className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-surface-raised transition-all duration-200 group-hover:bg-ink">
					<ArrowRight className="h-4 w-4 text-ink transition-colors duration-200 group-hover:text-surface-raised" />
				</div>
			</div>
		</button>
	);
}
