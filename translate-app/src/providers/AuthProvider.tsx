import type { IAuthContext } from "@/types/IAuthContext";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getStoredUser } from "@/lib/getStoredUser";
import { setStoredUser } from "@/lib/setStoredUser";
import type { AuthLoginResponse } from "@/types/api/AuthLoginResponse";
import toast from "react-hot-toast";
import { removeStoredUser } from "@/lib/removeStoredUser";
import { sleep } from "@/lib/utils";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IAuthContext["auth"]["username"]>(null);

  const isAuthenticated = !!user;

  const handleLogout = useCallback(async () => {
    const resetUser = async () => {
      removeStoredUser();
      setUser(null);
      await sleep(550);
    };
    await resetUser();
    toast.success("Logged out successfully!");
  }, []);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        },
      );
      if (!response.ok) {
        const body: AuthLoginResponse = await response.json();
        throw new Error(body.message);
      }
      const data: AuthLoginResponse = await response.json();
      if (!data.token) {
        throw toast.error("Error verifying login. Please try again.");
      }
      if (data.token) {
        setStoredUser(data.token);
        setUser(username);
        toast.success(data.message);
      }
    },
    [],
  );

  useEffect(() => {
    {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        console.log("User set from stored:", storedUser);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth: {
          username: user,
          isAuthenticated,
          login: handleLogin,
          logout: handleLogout,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
