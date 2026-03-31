import { Upload } from "lucide-react";
import { useRef, useState } from "react";

interface FileUploadCardProps {
	accept: string;
	onFileSelect: (file: File) => void;
	label: string;
	description: string;
}

export function FileUploadCard({
	accept,
	onFileSelect,
	label,
	description,
}: FileUploadCardProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [fileName, setFileName] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	function handleDragOver(event: React.DragEvent) {
		event.preventDefault();
		setIsDragging(true);
	}

	function handleDragLeave() {
		setIsDragging(false);
	}

	function handleDrop(event: React.DragEvent) {
		event.preventDefault();
		setIsDragging(false);
		const file = event.dataTransfer.files?.[0];
		if (file) {
			setFileName(file.name);
			onFileSelect(file);
		}
	}

	function handleClick() {
		inputRef.current?.click();
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setFileName(file.name);
			onFileSelect(file);
		}
	}

	return (
		// biome-ignore lint/a11y/useSemanticElements: Drag-drop area needs div element
		<div
			role="button"
			tabIndex={0}
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleClick();
				}
			}}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ${
				isDragging
					? "border-blue-500 bg-blue-50"
					: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
			}`}
		>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				onChange={handleFileChange}
				className="hidden"
			/>
			<div className="flex flex-col items-center text-center">
				<div
					className={`mb-4 rounded-full p-4 transition-colors ${
						isDragging
							? "bg-blue-100 text-blue-600"
							: "bg-gray-100 text-gray-400 group-hover:text-gray-500"
					}`}
				>
					<Upload className="h-8 w-8" />
				</div>
				{fileName ? (
					<>
						<p className="text-sm font-medium text-gray-900">{fileName}</p>
						<p className="mt-1 text-xs text-gray-500">
							Click or drag to replace
						</p>
					</>
				) : (
					<>
						<p className="text-sm font-medium text-gray-900">{label}</p>
						<p className="mt-1 text-xs text-gray-500">{description}</p>
					</>
				)}
			</div>
		</div>
	);
}
