export interface IAuthContext {
  auth: {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    user: {
      username: string | null;
      // Add other user properties from your backend
    } | null;
  };
}
