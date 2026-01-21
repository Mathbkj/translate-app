import type { IAuthContext } from "@/types/IAuthContext";
import { decodeBase64 } from "./utils";
import type { DecodedToken } from "@/types/DecodedToken";

export function getStoredUser() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;

  const strBase64 = decodeBase64(parts[1]);
  const payload: DecodedToken = JSON.parse(strBase64);
  return payload.username;
  //   return localStorage.getItem("authToken");
}
