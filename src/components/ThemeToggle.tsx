import { Moon, Sun } from "lucide-react";
import { useTheme } from "#/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="group flex h-10 w-10 items-center justify-center border-2 border-ink bg-surface-raised transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-ink"
			style={{ boxShadow: "2px 2px 0px 0px var(--color-ink)" }}
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			{theme === "light" ? (
				<Moon className="h-4 w-4 text-ink transition-colors duration-200 group-hover:text-surface-raised" />
			) : (
				<Sun className="h-4 w-4 text-ink transition-colors duration-200 group-hover:text-surface-raised" />
			)}
		</button>
	);
}
