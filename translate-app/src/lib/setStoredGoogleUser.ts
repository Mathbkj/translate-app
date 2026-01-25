export function setStoredGoogleUser(token: string | null) {
  if (!token) throw new Error("Cannot set empty token");
  localStorage.setItem("googleAuthToken", token);
}
