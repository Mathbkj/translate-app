import {
  createFileRoute,
  isRedirect,
  redirect,
  useRouter,
} from "@tanstack/react-router";

export const Route = createFileRoute("/__auth")({
  beforeLoad: ({ context, location }) => {
    const isAuthenticated = context.auth.isAuthenticated;
    const user = context.auth.user;
    try {
      if (!isAuthenticated)
        redirect({
          to: "/login",
          throw: true,
          replace: true,
          search: { redirect: "/" },
        });
      redirect({ to: "/app", replace: true });
      return { user };
    } catch (err) {
      if (isRedirect(err)) throw err;
      redirect({
        to: "/login",
        throw: true,
        search: { redirect: "/" },
      });
    }
  },
  loader: ({ context }) => {
    return context.auth.user;
  },
  component: AuthComponent,
});

function AuthComponent() {
  return <div>Hello "/__auth"!</div>;
}
