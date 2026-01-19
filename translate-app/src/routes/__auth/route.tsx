import { createFileRoute, Outlet, redirect, isRedirect, useRouter, useNavigate } from "@tanstack/react-router";
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

function AuthLayout() {
    const router = useRouter();
    const navigate = Route.useNavigate();
    const { auth } = useAuth();

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            const token = localStorage.getItem('authToken');
            try {
                await auth.logout();
                await router.invalidate().finally(() => navigate({ to: "/" }))
            }
            catch (error) {
                if (error instanceof Error) toast.error("Logout failed: " + error.message);
            }

        }
    }
    return <button onClick={handleLogout}>Log Out</button>

}
