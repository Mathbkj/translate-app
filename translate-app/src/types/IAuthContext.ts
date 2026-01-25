import type { Session } from "@supabase/supabase-js";

export interface IAuthContext {
  auth: {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    username: string | null;
  };
}
