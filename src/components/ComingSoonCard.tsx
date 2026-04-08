import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Clock } from "lucide-react";

interface ComingSoonCardProps {
	icon: LucideIcon;
	label: string;
	description: string;
	accentColor: string;
	accentBg: string;
}

export function ComingSoonCard({
	icon: Icon,
	label,
	description,
	accentColor,
	accentBg,
}: ComingSoonCardProps) {
	return (
		<div
			className="group relative flex w-full flex-col overflow-hidden border-2 border-ink bg-surface-raised transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5"
			style={{
				boxShadow: "4px 4px 0px 0px var(--color-ink)",
			}}
		>
			{/* Diagonal hatch background */}
			<div className="absolute inset-0 opacity-[0.03] diagonal-hatch" />

			{/* Top accent bar */}
			<div className={`h-1.5 w-full ${accentBg}`} />

			{/* Content */}
			<div className="relative flex flex-1 flex-col p-6">
				{/* Header: Icon + Badge */}
				<div className="mb-5 flex items-center justify-between">
					<div
						className={`flex h-12 w-12 items-center justify-center border-2 border-ink ${accentBg}`}
					>
						<Icon className="h-5 w-5" style={{ color: accentColor }} />
					</div>

					<div className="flex items-center gap-1.5 rounded-none border border-ink bg-surface px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-ink-faint">
						<Clock className="h-3 w-3" />
						<span>Soon</span>
					</div>
				</div>

				{/* Title */}
				<h3 className="font-display text-xl font-bold text-ink leading-tight">
					{label}
				</h3>

				{/* Description */}
				<p className="mt-2 text-sm text-ink-muted leading-relaxed">
					{description}
				</p>

				{/* Bottom indicator */}
				<div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
					<div className={`h-1.5 w-8 ${accentBg}`} />
					<span className="font-mono text-[10px] font-medium uppercase tracking-widest text-ink-faint transition-colors group-hover:text-ink-muted">
						In development
					</span>
					<ArrowUpRight className="ml-auto h-4 w-4 text-ink-faint transition-all group-hover:text-ink-muted group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</div>
			</div>
		</div>
	);
}
