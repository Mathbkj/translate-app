import {
  createRootRouteWithContext,
  Outlet
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { IAuthContext } from "@/types/IAuthContext";
import { Navbar } from "@/components/Navbar";

const RootLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRouteWithContext<IAuthContext>()({
  component: RootLayout,
});
