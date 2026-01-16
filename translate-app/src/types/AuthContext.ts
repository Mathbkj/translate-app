export interface AuthContext {
  auth: {
    isAuthenticated: boolean;
    user: {
      username: string;
      // Add other user properties from your backend
    } | null;
  };
}
