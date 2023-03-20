import { Button } from "antd";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { reducer } from "../../reducers/aboutUsReducer";
import { fetchCompanyDescription } from "../../services/api.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  description: "",
  isMounted: false,
};

export const AboutUs = () => {
  const [data, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (data.isMounted) {
      return;
    }

    fetchCompanyDescription()
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
