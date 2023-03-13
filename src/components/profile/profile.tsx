import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../constants";
import useToken from "../../services/token.service";
import styles from "./profile.module.css";
import { QuoteModal } from "./quote-modal/quote-modal";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  isMounted: false,
  isQuoteModalVisible: false,
  userName: "",
  fullQuote: "",
};

type State = {
  userName: string;
  fullQuote: string;
  isQuoteModalVisible: boolean;
  isMounted: boolean;
};

type UserNameAction = { type: "CHANGE_USERNAME"; payload: string };
type FullNameAction = { type: "CHANGE_FULLQUOTE"; payload: string };
type QuoteModalAction = { type: "CHANGE_IS_MODAL_VISIBLE"; payload: boolean };
type IsMountedAction = { type: "CHANGE_IS_MOUNTED"; payload: boolean };

type Action =
  | UserNameAction
  | FullNameAction
  | QuoteModalAction
  | IsMountedAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CHANGE_USERNAME":
      return {
        ...state,
        userName: action.payload,
      };
    case "CHANGE_FULLQUOTE":
      return {
        ...state,
        fullQuote: action.payload,
      };
    case "CHANGE_IS_MODAL_VISIBLE":
      return {
        ...state,
        isQuoteModalVisible: action.payload,
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

export const Profile = () => {
  const [data, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const { token, setToken } = useToken();

  const fetchProfileInformation = (): void => {
    fetch(
      `${API_URL}/profile?` +
        new URLSearchParams({
          token,
        }),
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        const { success, data } = result;

        if (!success) {
          toast.error(data?.message);
          navigate("/");
          return;
        }

        if (data?.fullname) {
          dispatch({ type: "CHANGE_USERNAME", payload: data.fullname });
        }

        dispatch({ type: "CHANGE_IS_MOUNTED", payload: true });
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  };

  const logout = () => {
    fetch(
      `${API_URL}/logout?` +
        new URLSearchParams({
          token: token,
        }),
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        const { success, data } = result;

        if (!success) {
          toast.error(data?.message);
          return;
        }

        setToken("");
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  };

  useEffect(() => {
    if (data.isMounted) {
      return;
    }

    fetchProfileInformation();
  }, []);

  useEffect(() => {
    document.title = "Profile";
  }, []);

  return (
    <>
      <h1 className="hidden">Profile</h1>
      <Button className="button" onClick={() => navigate("/")}>
        About us
      </Button>
      <Button className="button" type="primary">
        Profile
      </Button>
      <Button className="button" onClick={() => logout()}>
        Sign out
      </Button>
      {data.userName && (
        <div className={styles.profileWrapper}>
          <Avatar size={130} icon={<UserOutlined />} />
          <div className={styles.profileInformation}>
            <h2 className={styles.header}>Welcome, {data.userName}</h2>
            <Button
              className="button"
              type="primary"
              onClick={() =>
                dispatch({ type: "CHANGE_IS_MODAL_VISIBLE", payload: true })
              }
            >
              Update
            </Button>
          </div>
        </div>
      )}
      {data.fullQuote && <p>{data.fullQuote}</p>}
      <QuoteModal
        isQuoteModalVisible={data.isQuoteModalVisible}
        setIsQuoteModalVisible={(value) =>
          dispatch({ type: "CHANGE_IS_MODAL_VISIBLE", payload: value })
        }
        onQuoteFetched={(value) =>
          dispatch({ type: "CHANGE_FULLQUOTE", payload: value })
        }
      />
      <ToastContainer />
    </>
  );
};
