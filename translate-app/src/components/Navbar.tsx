import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function Navbar() {
    return (
        <nav className="sticky px-3 top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link to="/" className="mr-6 flex items-center space-x-2">
                        <Languages className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            TranslateApp
                        </span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm lg:gap-6">
                        <Link
                            to="/"
                            activeOptions={{ exact: true }}
                            className="transition-colors hover:text-foreground/80 [&.active]:text-foreground text-foreground/60"
                        >
                            Home
                        </Link>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/register">
                                Register
                            </Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link to="/login" search={{ redirect: "" }} preload="intent">
                                Login
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
