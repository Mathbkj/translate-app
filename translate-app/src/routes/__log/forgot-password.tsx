import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { User, Lock } from "lucide-react";
import { EyeShow } from "@/components/ui/eye-show";
import { EyeHide } from "@/components/ui/eye-hide";

export const Route = createFileRoute("/__log/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const navigate = useNavigate({ from: "/forgot-password" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: ({ value }) => {
        const errors: Record<string, string> = {};

        if (value.username.trim().length < 1) {
          errors.username = "Username is required";
        }

        if (value.password.trim().length < 6) {
          errors.password = "Password must be at least 6 characters";
        }

        if (value.confirmPassword !== value.password) {
          errors.confirmPassword = "Passwords do not match";
        }

        return Object.keys(errors).length > 0 ? { fields: errors } : undefined;
      },
      onSubmitAsync: async ({ value }) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/reset-password`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: value.username,
                password: value.password,
              }),
            },
          );

          if (!response.ok) {
            const body = await response.json();
            throw new Error(body.message || "Failed to reset password");
          }

          const body = await response.json();
          toast.success(body.message || "Password reset successfully");
          setIsSubmitted(true);

          setTimeout(() => {
            navigate({ to: "/login", search: { redirect: "/" } });
          }, 2000);
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          }
        }
      },
    },
  });

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Password Reset Successful
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Redirecting you to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your username and new password to reset your account
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
                  <div className="relative flex">
                    <Input
                      id="username"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="text"
                      placeholder="Username"
                    />
                    <User className="absolute right-3 bottom-2.5" size={16} />
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

            {/* New Password Field */}
            <form.Field name="password">
              {(field) => (
                <div>
                  <div className="relative flex">
                    <Input
                      id="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 bottom-2.5"
                    >
                      {showPassword ? <EyeHide /> : <EyeShow />}
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

            {/* Confirm Password Field */}
            <form.Field name="confirmPassword">
              {(field) => (
                <div>
                  <div className="relative flex">
                    <Input
                      id="confirmPassword"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 bottom-2.5"
                    >
                      {showConfirmPassword ? <EyeHide /> : <EyeShow />}
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

          <div className="flex flex-col items-center gap-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="group relative w-full"
                >
                  {isSubmitting ? <Spinner /> : "Reset Password"}
                </Button>
              )}
            </form.Subscribe>

            <div className="text-sm">
              <Link
                to="/login"
                search={{ redirect: "/" }}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
