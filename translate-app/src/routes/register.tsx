// "use client";
// import type { Route } from "./+types/register";
// import {
//   Form,
//   data,
//   redirect,
//   useFetcher,
//   type ActionFunctionArgs,
// } from "react-router";
// import { useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";

import { createFileRoute } from "@tanstack/react-router";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "Register - Translate App" },
//     { name: "description", content: "Create a new account" },
//   ];
// }

// export async function loader() {
//   console.log("hi server");
// }

// export async function clientLoader() {
//   return alert("Hi");
// }
// clientLoader.hydrate = true;

// // Handle the registration submission process
// export async function action({ request }: ActionFunctionArgs) {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   const formData = await request.formData();
//   const username = formData.get("username");
//   const password = formData.get("password");

//   const response = await fetch(
//     `${import.meta.env.VITE_BACKEND_URL.concat("register")}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//     }
//   );
//   if (!response.ok) {
//     const body = await response.json();
//     return { error: body.message };
//   }
//   return redirect("/login");
// }

// Handle the loader to check for existing session
// export async function clientLoader({ request }: ActionFunctionArgs) {
//   const token = localStorage.getItem("token");
//   return { token };
// }

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  return (
    <div className="min-h-screen text-light flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
        <form className="mt-8 space-y-6">
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
            <button type="submit" className="group mx-auto">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
