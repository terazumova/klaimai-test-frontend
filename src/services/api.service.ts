import { API_URL } from "../constants";
import {
  DeleteResponseData,
  InfoResponseData,
  LoginResponseData,
  ProfileResponseData,
  QuoteAction,
  User,
} from "../types/types";

export const fetchCompanyDescription = (): Promise<InfoResponseData> => {
  return fetch(`${API_URL}/info`, {
    method: "GET",
  }).then((response) => response.json());
};

export const fetchProfileInformation = (
  token: string
): Promise<ProfileResponseData> | undefined => {
  if (!token) {
    return;
  }

  return fetch(
    `${API_URL}/profile?` +
      new URLSearchParams({
        token,
      }),
    {
      method: "GET",
    }
  ).then((response) => response.json());
};

export const fetchLogout = (token: string): Promise<DeleteResponseData> => {
  return fetch(
    `${API_URL}/logout?` +
      new URLSearchParams({
        token: token,
      }),
    {
      method: "DELETE",
    }
  ).then((response) => response.json());
};

export const getWithCancel = (
  url: URL,
  isAuthorToken: boolean,
  dispatch: React.Dispatch<QuoteAction>
): Promise<string> => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();

  if (isAuthorToken) {
    dispatch({
      type: "CHANGE_CANCEL_AUTHOR_TOKEN",
      payload: {
        cancel: function () {
          xhr.abort();
        },
      },
    });
  } else {
    dispatch({
      type: "CHANGE_CANCEL_QUOTE_TOKEN",
      payload: {
        cancel: function () {
          xhr.abort();
        },
      },
    });
  }

  return new Promise(function (resolve, reject) {
    xhr.onload = function () {
      resolve(xhr.responseText);
    };
    xhr.onerror = reject;
    xhr.onabort = function () {
      reject(new Error("Cancelled"));
    };
  });
};

export const fetchLogin = (form: User): Promise<LoginResponseData> => {
  return fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: form.email,
      password: form.password,
    }),
  }).then((response) => response.json());
};
