import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the global styles along with Tailwind CSS support
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import type { AuthContext } from "./types/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Create a new router instance with placeholder context
const router = createRouter({
  routeTree,
  context: {
    auth: {
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
  const authContext = useAuth() as AuthContext;
  return <RouterProvider router={router} context={authContext} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
