import type { AuthVerifyEmailResponse } from "@/types/api/AuthVerifyEmailResponse";

export async function sendVerification(email: string) {
  let message = "";
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/verify/${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data: AuthVerifyEmailResponse = await response.json();
    message = data.message;
  } catch (err) {
    if (err instanceof Error) {
      message = err.message;
    }
  }
  return message;
}
