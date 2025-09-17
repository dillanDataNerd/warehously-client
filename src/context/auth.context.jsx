// use then context
// get rid of event listner


import { createContext, useEffect, useState } from "react";
import axios from "axios";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const AuthContext = createContext();

function AuthWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [user, setUser] = useState(null);

  const authenticateUser = () => {
    setIsLoading(true); 
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      axios
        .get(`${VITE_SERVER_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => {
          setIsLoggedIn(true);
          setUser(res.data);
          setLoggedUserId(res.data?._id ?? null);
        })
        .catch((err) => {
          setIsLoggedIn(false);
          setUser(null);
          setLoggedUserId(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setLoggedUserId(null);
      setIsLoading(false);
    }
  };

  const removeToken = () => localStorage.removeItem("authToken");

  const logOutUser = () => {
    removeToken();
    authenticateUser();
  };

  useEffect(() => {
    authenticateUser();
  }, []);

//Re-verify when page is restored from bfcache or becomes visible
  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) authenticateUser(); // restored from bfcache
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") authenticateUser();
    };
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // 3) Re-verify if authToken changes in another tab/window
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "authToken") authenticateUser();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const passedContext = {
    isLoggedIn,
    isLoading,
    loggedUserId,
    user,
    authenticateUser,
    logOutUser,
  };

  return (
    <AuthContext.Provider value={passedContext}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthWrapper };
