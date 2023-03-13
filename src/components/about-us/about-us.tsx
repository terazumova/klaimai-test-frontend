import { Button } from "antd";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  description: "",
  isMounted: false,
};

type State = {
  description: string;
  isMounted: boolean;
};

type DescriptionAction = { type: "CHANGE_DESCRIPTION"; payload: string };
type IsMountedAction = { type: "CHANGE_IS_MOUNTED"; payload: boolean };

type Action = DescriptionAction | IsMountedAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CHANGE_DESCRIPTION":
      return {
        ...state,
        description: action.payload,
      };
    case "CHANGE_IS_MOUNTED":
      return {
        ...state,
        isMounted: action.payload,
      };
    default:
      return state;
  }
};

export const AboutUs = () => {
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
          toast.error(data?.message);
          return;
        }

        if (data?.info) {
          dispatch({ type: "CHANGE_DESCRIPTION", payload: data.info });
          dispatch({ type: "CHANGE_IS_MOUNTED", payload: true });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (data.isMounted) {
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
      <ToastContainer />
    </>
  );
};
