import { createContext, useContext, useEffect, useState } from "react";

import { login as loginApi, register as registerApi, getMe } from "../services";

const Ctx = createContext(null);

export const useAuth = () => {
  return useContext(Ctx);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ks_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const data = await getMe();

        const currentUser = data.data.user;

        localStorage.setItem("ks_user", JSON.stringify(currentUser));

        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem("ks_token");
        localStorage.removeItem("ks_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const done = ({ token, user }) => {
    localStorage.setItem("ks_token", token);

    localStorage.setItem("ks_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const login = async (credentials) => {
    const response = await loginApi(credentials);

    return done(response.data);
  };

  const register = async (userData) => {
    const response = await registerApi(userData);

    return done(response.data);
  };

  const logout = () => {
    localStorage.removeItem("ks_token");
    localStorage.removeItem("ks_user");

    setUser(null);
  };

  return (
    <Ctx.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
