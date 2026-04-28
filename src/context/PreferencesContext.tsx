import { Store } from "@tauri-apps/plugin-store";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

export type Theme = "light" | "dark";
export type RecentFileType = "md" | "docx" | "pptx";

export interface RecentFiles {
	md: string[];
	docx: string[];
	pptx: string[];
}

export interface Preferences {
	theme: Theme;
	defaultOutputDir: string | null;
	openFolderAfterConvert: boolean;
	confirmBeforeOverwrite: boolean;
	recentFiles: RecentFiles;
}

const STORE_FILE = "preferences.json";
const PREFS_KEY = "preferences";
const RECENT_FILES_LIMIT = 5;

function systemTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function legacyTheme(): Theme | null {
	const stored = localStorage.getItem("theme");
	return stored === "light" || stored === "dark" ? stored : null;
}

function defaultPrefs(): Preferences {
	return {
		theme: legacyTheme() ?? systemTheme(),
		defaultOutputDir: null,
		openFolderAfterConvert: false,
		confirmBeforeOverwrite: true,
		recentFiles: { md: [], docx: [], pptx: [] },
	};
}

function mergePrefs(stored: Partial<Preferences> | null): Preferences {
	const base = defaultPrefs();
	if (!stored) return base;
	return {
		theme: stored.theme ?? base.theme,
		defaultOutputDir: stored.defaultOutputDir ?? base.defaultOutputDir,
		openFolderAfterConvert:
			stored.openFolderAfterConvert ?? base.openFolderAfterConvert,
		confirmBeforeOverwrite:
			stored.confirmBeforeOverwrite ?? base.confirmBeforeOverwrite,
		recentFiles: {
			md: stored.recentFiles?.md ?? base.recentFiles.md,
			docx: stored.recentFiles?.docx ?? base.recentFiles.docx,
			pptx: stored.recentFiles?.pptx ?? base.recentFiles.pptx,
		},
	};
}

interface PreferencesContextType {
	prefs: Preferences;
	isLoaded: boolean;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
	setDefaultOutputDir: (dir: string | null) => void;
	setOpenFolderAfterConvert: (value: boolean) => void;
	setConfirmBeforeOverwrite: (value: boolean) => void;
	addRecentFile: (type: RecentFileType, path: string) => void;
	clearRecentFiles: (type?: RecentFileType) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
	undefined,
);

export function PreferencesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);
	const [isLoaded, setIsLoaded] = useState(false);
	const storeRef = useRef<Store | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const store = await Store.load(STORE_FILE);
				const stored = await store.get<Partial<Preferences>>(PREFS_KEY);
				if (cancelled) return;
				const merged = mergePrefs(stored ?? null);
				storeRef.current = store;
				setPrefs(merged);
				setIsLoaded(true);
				// Persist immediately so the file exists with merged defaults,
				// and migrate any legacy localStorage theme.
				if (!stored) {
					await store.set(PREFS_KEY, merged);
					await store.save();
				}
				if (legacyTheme()) localStorage.removeItem("theme");
			} catch (err) {
				console.error("Failed to load preferences", err);
				setIsLoaded(true);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", prefs.theme);
	}, [prefs.theme]);

	const persist = useCallback(async (next: Preferences) => {
		const store = storeRef.current;
		if (!store) return;
		try {
			await store.set(PREFS_KEY, next);
			await store.save();
		} catch (err) {
			console.error("Failed to persist preferences", err);
		}
	}, []);

	const update = useCallback(
		(mutate: (prev: Preferences) => Preferences) => {
			setPrefs((prev) => {
				const next = mutate(prev);
				void persist(next);
				return next;
			});
		},
		[persist],
	);

	const toggleTheme = useCallback(
		() =>
			update((p) => ({
				...p,
				theme: p.theme === "light" ? "dark" : "light",
			})),
		[update],
	);

	const setTheme = useCallback(
		(theme: Theme) => update((p) => ({ ...p, theme })),
		[update],
	);

	const setDefaultOutputDir = useCallback(
		(defaultOutputDir: string | null) =>
			update((p) => ({ ...p, defaultOutputDir })),
		[update],
	);

	const setOpenFolderAfterConvert = useCallback(
		(openFolderAfterConvert: boolean) =>
			update((p) => ({ ...p, openFolderAfterConvert })),
		[update],
	);

	const setConfirmBeforeOverwrite = useCallback(
		(confirmBeforeOverwrite: boolean) =>
			update((p) => ({ ...p, confirmBeforeOverwrite })),
		[update],
	);

	const addRecentFile = useCallback(
		(type: RecentFileType, path: string) =>
			update((p) => {
				const existing = p.recentFiles[type].filter((f) => f !== path);
				const next = [path, ...existing].slice(0, RECENT_FILES_LIMIT);
				return {
					...p,
					recentFiles: { ...p.recentFiles, [type]: next },
				};
			}),
		[update],
	);

	const clearRecentFiles = useCallback(
		(type?: RecentFileType) =>
			update((p) => {
				if (!type) {
					return {
						...p,
						recentFiles: { md: [], docx: [], pptx: [] },
					};
				}
				return {
					...p,
					recentFiles: { ...p.recentFiles, [type]: [] },
				};
			}),
		[update],
	);

	const value = useMemo<PreferencesContextType>(
		() => ({
			prefs,
			isLoaded,
			toggleTheme,
			setTheme,
			setDefaultOutputDir,
			setOpenFolderAfterConvert,
			setConfirmBeforeOverwrite,
			addRecentFile,
			clearRecentFiles,
		}),
		[
			prefs,
			isLoaded,
			toggleTheme,
			setTheme,
			setDefaultOutputDir,
			setOpenFolderAfterConvert,
			setConfirmBeforeOverwrite,
			addRecentFile,
			clearRecentFiles,
		],
	);

	return (
		<PreferencesContext.Provider value={value}>
			{children}
		</PreferencesContext.Provider>
	);
}

export function usePreferences() {
	const ctx = useContext(PreferencesContext);
	if (!ctx) {
		throw new Error("usePreferences must be used within a PreferencesProvider");
	}
	return ctx;
}

export function useTheme() {
	const { prefs, toggleTheme, setTheme } = usePreferences();
	return { theme: prefs.theme, toggleTheme, setTheme };
}
