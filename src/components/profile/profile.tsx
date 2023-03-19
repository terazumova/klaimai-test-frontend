import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../constants";
import { reducer } from "../../reducers/profileReducer";
import useToken from "../../services/token.service";
import styles from "./profile.module.css";
import { QuoteModal } from "./quote-modal/quote-modal";

const initialState = {
  isMounted: false,
  isQuoteModalVisible: false,
  fullname: "",
  fullQuote: "",
};

export const Profile = () => {
  const [data, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const { token, setToken } = useToken();

  const fetchProfileInformation = (): void => {
    if (!token) {
      return;
    }

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
          toast.error(data.message);
          return;
        }

        if (data?.fullname) {
          dispatch({ type: "CHANGE_USERNAME", payload: data.fullname });
          dispatch({ type: "CHANGE_IS_MOUNTED", payload: true });
        }
      })
      .catch((error) => {
        console.error(error);
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
          toast.error(data.message);
          return;
        }

        setToken("");
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
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
      {data.fullname && (
        <div className={styles.profileWrapper}>
          <Avatar size={130} icon={<UserOutlined />} />
          <div className={styles.profileInformation}>
            <h2 className={styles.header}>Welcome, {data.fullname}</h2>
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
        onQuoteFetched={(fullQuote) =>
          dispatch({ type: "CHANGE_FULLQUOTE", payload: fullQuote })
        }
      />
    </>
  );
};
