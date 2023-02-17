import { Button } from "antd";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./about-us.module.css";

const initialState = {
  description: "",
};

const reducer = (state: any, action: any) => {
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

  const fetchCompanyDescription = () => {
    fetch(`${process.env.REACT_APP_PUBLIC_API_URL}/info`)
      .then((response) => response.json())
      .then(({ data }) => {
        dispatch({ type: "CHANGE_DESCRIPTION", payload: data.info });
        setIsMounted(true);
      });
  };

  useEffect(() => {
    if (isMounted) {
      return;
    }

    fetchCompanyDescription();
  }, []);

  return (
    <>
      <h1 className={styles.hidden}>About us</h1>
      <Button className={styles.button}>About us</Button>
      <Button className={styles.button} onClick={() => navigate("/login")}>
        Sign in
      </Button>
      <h2 className={styles.description}>{data?.description ?? ""}</h2>
    </>
  );
};
