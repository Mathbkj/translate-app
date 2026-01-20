import TranslateApp from "@/components/translate-app";
import {
  createFileRoute,
  isRedirect,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "src/hooks/useAuth";

export const Route = createFileRoute("/__auth/app")({
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
  component: AppComponent,
});
function AppComponent() {
  return <TranslateApp />;
}
