import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export interface AuthContext {
  auth: {
    isAuthenticated: boolean
    user?: {
      id: string
      username: string
      email?: string
      // Add other user properties from your backend
    }
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
  }
}


const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/" activeProps={{ style: { fontWeight: "bold" } }} activeOptions={{ exact: true }}>
        Home
      </Link>{" "}
      <Link to="/register" activeProps={{ style: { fontWeight: "bold" } }} preload="intent">
        Register
      </Link>
      <Link to="/login" activeProps={{ style: { fontWeight: "bold" } }}>
        Login
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRouteWithContext<AuthContext>()({ component: RootLayout });
