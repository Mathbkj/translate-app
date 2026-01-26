import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { EyeShow } from "@/components/ui/eye-show";
import { EyeHide } from "@/components/ui/eye-hide";
import { useAuth } from "src/hooks/useAuth";
import { sleep } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/__log/login")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
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
                    <Button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center rounded-l-none"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeShow /> : <EyeHide />}
                    </Button>
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
            <div className="flex items-center"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="group relative w-full"
                >
                  {isSubmitting ? <Spinner /> : "Sign in"}
                </Button>
              )}
            </form.Subscribe>
            {/* Or */}
            {/* TODO: Implement Google Login <Button
              type="button"
              variant="ghost"
              onClick={async () => await auth.loginGoogle()}
            >
              Continue With Google
              <img src={GoogleLogo} className="object-cover size-full" />
            </Button> */}
          </div>
        </form>
      </div>
    </div>
  );
}
