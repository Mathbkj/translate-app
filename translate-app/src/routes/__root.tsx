import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { IAuthContext } from "@/types/IAuthContext";
import { Navbar } from "@/components/navbar";
import { Toaster } from "react-hot-toast";

const RootLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <TanStackRouterDevtools />
    <Toaster position="top-left" />
  </>
);

export const Route = createRootRouteWithContext<IAuthContext>()({
  component: RootLayout,
});
