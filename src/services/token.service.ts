import Cookies from "js-cookie";
import { useState } from "react";

export default function useToken() {
  const getToken = (): string => Cookies.get("token") ?? "";

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: string): void => {
    setCookie("token", userToken);
    setToken(userToken);
  };

  const setCookie = (name: string, token?: string): void => {
    if (!token) {
      Cookies.remove(name);
      return;
    }

    Cookies.set(name, token);
  };

  return {
    setToken: saveToken,
    token,
  };
}
