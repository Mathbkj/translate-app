import { supabase } from "~/db";
import type { Route } from "./+types/register";
import {
  Form,
  redirect,
  useFetcher,
  type ActionFunctionArgs,
} from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register - Translate App" },
    { name: "description", content: "Create a new account" },
  ];
}

// Handle the registration submission process
export async function clientAction({ request }: ActionFunctionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const data = await request.formData();
  const username = data.get("username");
  const password = data.get("password");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL.concat("register")}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }
  );
  if (!response.ok) {
    const data = await response.json();
    return { ok: false, error: data.error };
  }
  return { ok: true, error: null };
}

// Handle the loader to check for existing session
// export async function clientLoader({ request }: ActionFunctionArgs) {
//   const token = localStorage.getItem("token");
//   return { token };
// }

export default function Register() {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";
  const { error } = fetcher.data || {};

  useEffect(() => {
    console.log(`Fetcher data: `, fetcher.data);
  }, [fetcher.data]);

  return (
    <div className="min-h-screen text-light flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {error && <span>{error}</span>}
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
        <fetcher.Form
          action="/register"
          method="post"
          onSubmit={(ev) => fetcher.submit(ev.currentTarget)}
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {busy ? "Registering..." : "Register"}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
