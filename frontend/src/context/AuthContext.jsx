import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("nyaay-user");
    return stored ? JSON.parse(stored) : null;
  });

  const value = useMemo(() => ({
    user,
    loading: false,
    clerkEnabled: Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY),
    orgName: localStorage.getItem("nyaay-org") || "Nyaay Demo Org",
    login: async (email) => {
      const nextUser = { id: "local-demo-user", email };
      localStorage.setItem("nyaay-user", JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    },
    googleLogin: async () => {
      const nextUser = { id: "local-google-demo", email: "demo@nyaay.ai" };
      localStorage.setItem("nyaay-user", JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    },
    register: async ({ orgName, email }) => {
      const nextUser = { id: "local-demo-user", email };
      localStorage.setItem("nyaay-org", orgName);
      localStorage.setItem("nyaay-user", JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    },
    logout: async () => {
      localStorage.removeItem("nyaay-user");
      setUser(null);
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
