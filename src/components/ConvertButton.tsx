import type { LucideIcon } from "lucide-react";

interface ConvertButtonProps {
	icon: LucideIcon;
	label: string;
	description: string;
	onClick: () => void;
	color: string;
}

export function ConvertButton({
	icon: Icon,
	label,
	description,
	onClick,
	color,
}: ConvertButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group flex w-full flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-gray-200/50 hover:-translate-y-1"
		>
			<div className={`mb-4 rounded-xl p-3 ${color}`}>
				<Icon className="h-6 w-6" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900">{label}</h3>
			<p className="mt-1 text-sm text-gray-500">{description}</p>
		</button>
	);
}
