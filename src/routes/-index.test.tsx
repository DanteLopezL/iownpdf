import { createRouter, RouterProvider } from "@tanstack/react-router";
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { routeTree } from "#/routeTree.gen";

const mocks = vi.hoisted(() => ({
	invoke: vi.fn(),
	onDragDropEvent: vi.fn(() => Promise.resolve(() => {})),
	listen: vi.fn(() => Promise.resolve(() => {})),
	store: {
		get: vi.fn(),
		set: vi.fn(),
		save: vi.fn(),
	},
}));

vi.mock("@tauri-apps/api/core", () => ({
	invoke: mocks.invoke,
}));

vi.mock("@tauri-apps/api/window", () => ({
	getCurrentWindow: () => ({
		onDragDropEvent: mocks.onDragDropEvent,
	}),
}));

vi.mock("@tauri-apps/api/event", () => ({
	listen: mocks.listen,
}));

vi.mock("@tauri-apps/plugin-store", () => ({
	Store: {
		load: vi.fn(() => Promise.resolve(mocks.store)),
	},
}));

vi.mock("@tanstack/react-devtools", () => ({
	TanStackDevtools: () => null,
}));

vi.mock("@tanstack/react-router-devtools", () => ({
	TanStackRouterDevtoolsPanel: () => null,
}));

function renderApp() {
	const router = createRouter({
		routeTree,
		defaultPreload: "intent",
		scrollRestoration: true,
	});

	return render(<RouterProvider router={router} />);
}

describe("conversion home", () => {
	beforeEach(() => {
		window.scrollTo = vi.fn();
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
		mocks.invoke.mockImplementation((command: string) => {
			if (command === "pick_file") return Promise.resolve("/tmp/note.markdown");
			if (command === "path_exists") return Promise.resolve(false);
			if (command === "convert_to_pdf") return Promise.resolve("/tmp/note.pdf");
			return Promise.resolve(null);
		});
		mocks.onDragDropEvent.mockReturnValue(Promise.resolve(() => {}));
		mocks.listen.mockReturnValue(Promise.resolve(() => {}));
		mocks.store.get.mockResolvedValue(null);
		mocks.store.set.mockResolvedValue(undefined);
		mocks.store.save.mockResolvedValue(undefined);
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
		localStorage.clear();
	});

	it("converts a picked markdown file through the current Tauri command", async () => {
		renderApp();

		fireEvent.click(await screen.findByRole("button", { name: /markdown/i }));
		fireEvent.click(
			screen.getByRole("button", { name: /select a markdown file/i }),
		);
		expect(await screen.findByText("note.markdown")).toBeTruthy();
		fireEvent.click(screen.getByRole("button", { name: /convert to pdf/i }));

		await waitFor(() => {
			expect(mocks.invoke).toHaveBeenCalledWith("convert_to_pdf", {
				filePath: "/tmp/note.markdown",
				fileType: "md",
				outputDir: null,
			});
		});
		expect(await screen.findByText(/conversion successful/i)).toBeTruthy();
		expect(screen.getByText("/tmp/note.pdf")).toBeTruthy();
	});

	it("asks for confirmation before overwriting an existing output file", async () => {
		mocks.invoke.mockImplementation((command: string) => {
			if (command === "pick_file") return Promise.resolve("/tmp/report.docx");
			if (command === "path_exists") return Promise.resolve(true);
			if (command === "convert_to_pdf")
				return Promise.resolve("/tmp/report.pdf");
			return Promise.resolve(null);
		});

		renderApp();

		fireEvent.click(await screen.findByRole("button", { name: /word/i }));
		fireEvent.click(
			screen.getByRole("button", { name: /select a word file/i }),
		);
		expect(await screen.findByText("report.docx")).toBeTruthy();
		fireEvent.click(screen.getByRole("button", { name: /convert to pdf/i }));

		expect(await screen.findByText(/file already exists/i)).toBeTruthy();
		expect(mocks.invoke).not.toHaveBeenCalledWith(
			"convert_to_pdf",
			expect.anything(),
		);

		fireEvent.click(screen.getByRole("button", { name: /overwrite/i }));

		await waitFor(() => {
			expect(mocks.invoke).toHaveBeenCalledWith("convert_to_pdf", {
				filePath: "/tmp/report.docx",
				fileType: "docx",
				outputDir: null,
			});
		});
	});
});
