import { useEffect, useState } from "react";
import type { AuthContext } from "src/types/AuthContext";
import { getUsername } from "src/lib/getUserId";

export function useAuth(): AuthContext | null {
  const [data, setData] = useState<AuthContext | null>(null);

  useEffect(() => {
    const unsubscribe = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setData((prev) => ({
          ...prev,
          auth: {
            isAuthenticated: true,
            user: getUsername(token),
          },
        }));
      }
    };
    return unsubscribe;
  }, []);

  return data;
}
