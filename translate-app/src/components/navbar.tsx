import { Link, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useAuth } from "src/hooks/useAuth";
import { toast } from "react-hot-toast";

export function Navbar() {
  const { auth } = useAuth();
  const router = useRouter();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      auth.logout();
      // Navigate after state is cleared
      navigate({ to: "/" });
    } catch (error) {
      if (error instanceof Error)
        toast.error("Logout failed: " + error.message);
    }
  };

  return (
    <nav className="sticky px-3 top-0 z-50 w-full flex justify-center items-center bg-white/95 backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link
            to="/"
            className="mr-6 flex items-center space-x-2 text-primary hover:text-primary-hover transition"
          >
            <Languages className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-4 text-sm lg:gap-6">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="font-medium text-text-primary transition hover:text-primary"
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-gray-dark" }}
            >
              Home
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center gap-2">
            {!auth.isAuthenticated && (
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to="/register"
                  className="text-gray-dark hover:text-foreground"
                  preload="intent"
                >
                  Register
                </Link>
              </Button>
            )}
            {auth.isAuthenticated ? (
              <Button size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button size="sm" asChild>
                <Link to="/login" search={{ redirect: "" }} preload="intent">
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
