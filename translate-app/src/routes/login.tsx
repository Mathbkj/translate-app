import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { EyeShow } from "src/components/ui/EyeShow";
import { EyeHide } from "src/components/ui/EyeHide";
import type { AuthRegisterResponse } from "src/types/api/AuthRegisterResponse";
import type { AuthLoginResponse } from "src/types/api/AuthLoginResponse";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const navigate = useNavigate({ from: Route.fullPath });
  const [showPassword, setShowPassword] = useState(false);

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
        return Object.keys(errors).length > 0
          ? { fields: errors }
          : undefined;
      },
      onSubmitAsync: async ({ value }) => {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: value.username,
              password: value.password,
            }),
          }
        );

        if (!response.ok) {
          const body: AuthLoginResponse = await response.json();
          return {
            form: body.message || 'Invalid username or password.',
            fields: {
              password: body.message,
            }
          }
        }

        const data: AuthLoginResponse = await response.json();
        // Store token or session data
        if (data.token) {
          toast.success(data.message);
          // Redirect to the page they were trying to access, or home
          setTimeout(() => {
            navigate({ to: "../auth" })
          }, 1000);
          return data.token;
        }
      }
    }
  });

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
          <div className="rounded-md shadow-sm space-y-2">
            {/* Username Field */}
            <form.Field
              name="username"
            >
              {(field) => (
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Username"
                  />
                  {field.state.meta.errors && (
                    <span aria-live="assertive" className="text-error text-sm mt-1">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field
              name="password"
            >
              {(field) => (
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  sm:text-sm"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeShow />
                      ) : (
                        <EyeHide />
                      )}
                    </button>
                  </div>
                  {field.state.meta.errors && (
                    <span aria-live="assertive" className="text-error text-sm mt-1">
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
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
