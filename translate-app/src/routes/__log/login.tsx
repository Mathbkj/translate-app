import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { EyeShow } from "@/components/ui/eye-show";
import { EyeHide } from "@/components/ui/eye-hide";
import type { AuthLoginResponse } from "@/types/api/AuthLoginResponse";
import { useAuth } from "src/hooks/useAuth";
import { sleep } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/__log/login")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/app",
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      console.log("Authenticated", search.redirect);
      redirect({ to: search.redirect, throw: true });
    }
  },
  component: Login,
});

function Login() {
  const { auth } = useAuth();
  const router = useRouter();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const navigate = useNavigate({ from: Route.fullPath });
  const [showPassword, setShowPassword] = useState(false);

  const search = Route.useSearch();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: ({ value }) => {
        const errors: Record<string, string> = {};
        if (value.username.trim().length < 1) {
          errors.username = "Username is required";
        }
        if (value.password.trim().length < 1) {
          errors.password = "Password is required";
        }
        return Object.keys(errors).length > 0 ? { fields: errors } : undefined;
      },
      onSubmitAsync: async ({ value }) => {
        try {
          await auth.login(value.username, value.password);
          await sleep(250);
          await router.invalidate();
          router.history.push(search.redirect);
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          }
        }
      },
    },
  });

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </a>
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            {/* Username Field */}
            <form.Field name="username">
              {(field) => (
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <Input
                    id="username"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="Username"
                  />
                  {field.state.meta.errors && (
                    <span
                      aria-live="assertive"
                      className="text-error text-sm mt-1"
                    >
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field name="password">
              {(field) => (
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="pr-10"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeShow /> : <EyeHide />}
                    </button>
                  </div>
                  {field.state.meta.errors && (
                    <span
                      aria-live="assertive"
                      className="text-error text-sm mt-1"
                    >
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Spinner /> : "Sign in"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
