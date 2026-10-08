import { useState } from "react";

import AuthContext from "./auth-context";

export { AuthContext };

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const savedUser = sessionStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "Invalid user data in sessionStorage:",
        error
      );

      sessionStorage.removeItem("user");

      return null;
    }
  });


  // ==========================================
  // LOGIN
  // ==========================================

  const login = (userData) => {

    console.log("Login user data:", userData);

    setUser(userData);

    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {

    setUser(null);

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };


  return (

    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
}