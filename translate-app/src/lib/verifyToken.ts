// Verify user and authorize its access to protected routes

import type { AuthVerifyTokenResponse } from "@/types/api/AuthVerifyTokenResponse";

export async function verifyToken(token: string) {
  let message = "";
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/verifyToken`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    const body: AuthVerifyTokenResponse = await response.json();
    message = body.message;
  }
  const body: AuthVerifyTokenResponse = await response.json();
  message = body.message;

  return message;
}
