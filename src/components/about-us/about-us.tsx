import { Button } from "antd";
import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    axios
      .get(`${process.env.REACT_APP_PUBLIC_API_URL}/info`)
      .then(({ data: response }) => {
        const result = response?.data;

        if (result?.info) {
          dispatch({ type: "CHANGE_DESCRIPTION", payload: result.info });
          setIsMounted(true);
        }
      });
  };

  useEffect(() => {
    if (isMounted) {
      return;
    }

    fetchCompanyDescription();
  }, []);

  useEffect(() => {
    document.title = 'About us';
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
