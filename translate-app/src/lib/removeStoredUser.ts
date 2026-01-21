export function removeStoredUser(token: string = "authToken") {
  localStorage.removeItem(token);
}
