import type { IAuthContext } from "@/types/IAuthContext";
import { createContext } from "react";

export const AuthContext = createContext<IAuthContext | null>(null);