import toast from "react-hot-toast";

// Log the user out
export async function logoutUser(token: string) {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("authToken");
  } catch (err) {
    if (err instanceof Error) toast.error(`Logout failed: ${err.message}`);
  }
}
