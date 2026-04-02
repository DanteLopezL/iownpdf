import { createFileRoute } from "@tanstack/react-router";
import { FileEdit, FileText, Presentation } from "lucide-react";
import { useState } from "react";
import { ConvertButton } from "#/components/ConvertButton";
import { FileUploadCard } from "#/components/FileUploadCard";
import { Modal } from "#/components/Modal";

export const Route = createFileRoute("/")({ component: App });

type FileType = "md" | "pptx" | "docx" | null;

function App() {
	const [openModal, setOpenModal] = useState<FileType>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	function handleFileSelect(file: File) {
		setSelectedFile(file);
		console.log("Selected file:", file.name);
		// TODO: Add conversion logic here
	}

	function handleCloseModal() {
		setOpenModal(null);
		setSelectedFile(null);
	}

	const fileConfigs = {
		md: {
			accept: ".md,.markdown",
			label: "Drop your Markdown file here",
			description: "or click to browse .md files",
			title: "Convert Markdown",
			icon: FileText,
			color: "bg-blue-100 text-blue-600",
			descriptionText: "Convert Markdown to PDF",
		},
		pptx: {
			accept: ".pptx",
			label: "Drop your PowerPoint file here",
			description: "or click to browse .pptx files",
			title: "Convert PowerPoint",
			icon: Presentation,
			color: "bg-orange-100 text-orange-600",
			descriptionText: "Convert PowerPoint to PDF",
		},
		docx: {
			accept: ".docx",
			label: "Drop your Word file here",
			description: "or click to browse .docx files",
			title: "Convert Word",
			icon: FileEdit,
			color: "bg-indigo-100 text-indigo-600",
			descriptionText: "Convert Word to PDF",
		},
	};

	const currentConfig = openModal ? fileConfigs[openModal] : null;

	return (
		<main className="min-h-screen bg-linear-to-b from-gray-50 to-white py-16">
			<div className="mx-auto max-w-5xl px-6">
				{/* Header */}
				<div className="mb-16 text-center">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900">
						i own pdf
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						Convert your documents to PDF with ease
					</p>
				</div>

				{/* Conversion Cards */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<ConvertButton
						icon={FileText}
						label="Markdown"
						description={fileConfigs.md.descriptionText}
						onClick={() => setOpenModal("md")}
						color={fileConfigs.md.color}
					/>
					<ConvertButton
						icon={Presentation}
						label="PowerPoint"
						description={fileConfigs.pptx.descriptionText}
						onClick={() => setOpenModal("pptx")}
						color={fileConfigs.pptx.color}
					/>
					<ConvertButton
						icon={FileEdit}
						label="Word"
						description={fileConfigs.docx.descriptionText}
						onClick={() => setOpenModal("docx")}
						color={fileConfigs.docx.color}
					/>
				</div>

				{/* Modal */}
				{currentConfig && (
					<Modal
						isOpen={!!openModal}
						onClose={handleCloseModal}
						title={currentConfig.title}
					>
						<FileUploadCard
							accept={currentConfig.accept}
							onFileSelect={handleFileSelect}
							label={currentConfig.label}
							description={currentConfig.description}
						/>
						{selectedFile && (
							<div className="mt-6">
								<button
									type="button"
									className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
								>
									Convert to PDF
								</button>
							</div>
						)}
					</Modal>
				)}
			</div>
		</main>
	);
}
