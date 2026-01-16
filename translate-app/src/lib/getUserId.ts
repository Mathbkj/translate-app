// Functionality to get the username from the token
export function getUsername(token: string) {
  const payloadBase64 = JSON.parse(atob(token.split(".")[1]));
  return payloadBase64.username;
}
