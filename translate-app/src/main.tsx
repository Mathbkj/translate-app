import { StrictMode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the global styles along with Tailwind CSS support
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import type { IAuthContext } from "./types/IAuthContext";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./providers/AuthProvider";

// Create a new router instance with placeholder context
const router = createRouter({
  routeTree,
  context: {
    auth: {
      login(username, password) {
        return Promise.resolve();
      },
      loginGoogle() {
        return Promise.resolve();
      },
      logout() {
        return Promise.resolve();
      },
      isAuthenticated: false,
      user: null,
    }, // Will be provided in React component
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const authContext = useAuth() as IAuthContext;
  return <RouterProvider router={router} context={authContext} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </StrictMode>,
  );
}
