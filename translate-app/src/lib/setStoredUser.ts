export function setStoredUser(token: string | null) {
  if (!token) throw new Error("Cannot set empty token");
  localStorage.setItem("authToken", token);
}
