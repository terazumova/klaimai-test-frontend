import { Button } from "antd";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import { toast } from "react-toastify";

const initialState = {
  description: "",
};

type State = {
  description: string;
};

type Action = {
  type: string;
  payload: string;
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "CHANGE_DESCRIPTION":
      return {
        ...state,
        description: action.payload,
      };
    default:
      return state;
  }
};

export const AboutUs = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [data, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const fetchCompanyDescription = (): void => {
    fetch(`${API_URL}/info`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        const { success, data } = result;

        if (!success) {
          toast.error(data.message);
          return;
        }

        if (data?.info) {
          dispatch({ type: "CHANGE_DESCRIPTION", payload: data.info });
          setIsMounted(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (isMounted) {
      return;
    }

    fetchCompanyDescription();
  }, []);

  useEffect(() => {
    document.title = "About us";
  }, []);

  return (
    <>
      <h1 className="hidden">About us</h1>
      <Button className="button" type="primary">
        About us
      </Button>
      <Button className="button" onClick={() => navigate("/login")}>
        Sign in
      </Button>
      <h2>{data?.description ?? ""}</h2>
    </>
  );
};
