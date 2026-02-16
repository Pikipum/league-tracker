import { useSyncExternalStore } from "react";

const AUTH_EVENT = "auth:changed";

const subscribe = (callback) => {
  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

const getSnapshot = () => localStorage.getItem("token");

const notifyAuthChanged = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

const useAuth = () => {
  const token = useSyncExternalStore(subscribe, getSnapshot);

  return { token, notifyAuthChanged };
};

export default useAuth;
