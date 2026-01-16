import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ context }) => {
    const isAuthenticated = context.auth.isAuthenticated;
    const user = context.auth.user;
    try {
      if (!isAuthenticated || !user)
        redirect({
          from: Route.fullPath,
          to: "../login",
          throw: true,
          replace: true,
        });
      return { user };
    } catch (err) {
      if (isRedirect(err)) throw err;
      throw redirect({
        from: Route.fullPath,
        to: "../login",
        search: {},
      });
    }
  },
  component: AuthComponent,
});

// Authentication component
function AuthComponent() {
  // return <Navigate from={Route.fullPath} to=".." />
  return <div>Auth</div>;
}
