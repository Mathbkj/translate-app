import toast from "react-hot-toast";
import type { AuthVerifyResponse } from "src/types/api/AuthVerifyResponse";

// Verify user and authorize its access to protected routes
export async function verifyUser(token: string) {
  let message = "";
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body: AuthVerifyResponse = await response.json();
    message = body.message;
  }
  const body: AuthVerifyResponse = await response.json();
  message = body.message;

  return message;
}
