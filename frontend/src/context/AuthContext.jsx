import { createContext, useContext, useState, useEffect } from "react";
import api from "../api"; // Use the axios instance we created

// 1. Create the Context (The "Radio Station")
const AuthContext = createContext();

// 2. The Provider Component (The "Broadcast Tower")
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when the app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // We try to fetch todos. If it works, we are logged in.
        // If it fails (401), we are not.
        await api.get("/todos");
        setUser({ loggedIn: true });
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    // This throws an error if login fails, which the Login component catches
    await api.post("/auth/login", { email, password });
    setUser({ loggedIn: true });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      // Always clear user state, even if API errors
      setUser(null);
    }
  };

  // 3. Expose the values to the rest of the app
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Custom Hook (The "Radio Receiver")
// This is what you import in your components: const { login } = useAuth();
export const useAuth = () => {
  return useContext(AuthContext);
};
