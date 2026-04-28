import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { CustomTitleBar } from "#/components/CustomTitleBar";
import { PreferencesProvider } from "#/context/PreferencesContext";

import "../styles.css";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<PreferencesProvider>
			<div className="window-frame">
				<CustomTitleBar />
				<Outlet />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "TanStack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
			</div>
		</PreferencesProvider>
	);
}
