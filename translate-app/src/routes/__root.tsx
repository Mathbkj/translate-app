import {
  createRootRoute,
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { AuthContext } from "src/types/AuthContext";

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link
        to="/"
        activeProps={{ style: { fontWeight: "bold" } }}
        activeOptions={{ exact: true }}
      >
        Home
      </Link>
      <Link
        to="/register"
        activeProps={{ style: { fontWeight: "bold" } }}
        preload="intent"
      >
        Register
      </Link>
      <Link
        to="/login"
        activeProps={{ style: { fontWeight: "bold" } }}
        preload="intent"
      >
        Login
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRouteWithContext<AuthContext>()({
  component: RootLayout,
});
