import TranslateApp from "@/components/translate-app";
import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
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
      redirect({ to: "/", replace: true });
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
  component: AppComponent,
});
function AppComponent() {
  return <TranslateApp />;
}