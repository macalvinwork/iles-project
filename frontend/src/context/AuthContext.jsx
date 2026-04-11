import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // FAKE LOGIN (backend will replace later)
    if (!email || !password) return false;

    // fake role assignment
    let role = "student";

    if (email.includes("admin")) role = "admin";
    else if (email.includes("supervisor")) role = "supervisor";
    else if (email.includes("academic")) role = "academic";

    const fakeUser = { email, role };

    setUser(fakeUser);
    return fakeUser;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);