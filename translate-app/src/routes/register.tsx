import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useForm, useStore } from "@tanstack/react-form";
import toast, { Toaster } from "react-hot-toast";
import type { AuthRegisterResponse } from "src/types/api/AuthRegisterResponse";
import { useEffect, useState } from "react";
import { EyeShow } from "src/components/ui/EyeShow";
import { EyeHide } from "src/components/ui/EyeHide";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const navigate = useNavigate({ from: "/register" })
  const isNavigating = useRouterState({
    select: (state) => state.isLoading
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: ({ value, formApi }) => {
        const errors: Record<string, string> = {};

        if (value.username.trim().length < 1) {
          errors.username = "Username is required";
        }
        if (value.password.trim().length < 6) {
          errors.password = "Password must be at least 6 characters";
        }
        if (value.password.toLowerCase().trim() !== formApi.getFieldValue("confirmPassword").toLocaleLowerCase().trim()) {
          errors.confirmPassword = "Passwords do not match";
        }
        return Object.keys(errors).length > 0
          ? { fields: errors }
          : undefined;
      },
      onSubmitAsync: async ({ value }) => {

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: value.username,
              password: value.confirmPassword,
            }),
          }
        );

        if (!response.ok) {
          const body: AuthRegisterResponse = await response.json();
          return {
            form: 'Invalid or existing username. Please choose another.',
            fields: {
              confirmPassword: body.message,
            }
          }
        }
        const body: AuthRegisterResponse = await response.json();

        toast.success(body.message);
        setTimeout(() => {
          navigate({ to: "/login" });
        }, 1000)
      }

    }
  });

  if (isNavigating) {
    return <h1>Loading...</h1>
  }
  return (
    <div className="min-h-screen text-light flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
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
              name="username"        >
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
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                      autoComplete="new-password"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

            {/* Confirm Password Field - Links to password field */}
            <form.Field
              validators={{ onChangeListenTo: ['password'] }}
              name="confirmPassword"
            >
              {(field) => (
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-50 sm:text-sm"
                      placeholder="Confirm Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex not-disabled:cursor-pointer items-center text-gray-500 hover:text-gray-700"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
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
                  {isSubmitting ? <Loader className="animate-spin " /> : "Create account"}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
