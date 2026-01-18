import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { logoutUser } from "src/lib/logoutUser";

export const Route = createFileRoute("/__auth/app")({
  component: AppComponent,
});
function AppComponent() {
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    await logoutUser(token ? token : "");
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
