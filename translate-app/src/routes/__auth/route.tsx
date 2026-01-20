import TranslateApp from "@/components/translate-app";
import {
  createFileRoute,
  Outlet,
  redirect,
  isRedirect,
  useRouter,
  useNavigate,
} from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useAuth } from "src/hooks/useAuth";

export const Route = createFileRoute("/__auth")({
  beforeLoad: ({ context, location }) => {
    const isAuthenticated = context.auth.isAuthenticated;
    try {
      if (!isAuthenticated)
        redirect({
          to: "/login",
          throw: true,
          replace: true,
          search: { redirect: location.href },
        });
      const user = context.auth.user;
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
  component: () => <Outlet />,
});
