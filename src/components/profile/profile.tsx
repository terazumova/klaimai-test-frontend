import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../constants";
import useToken from "../../services/token.service";
import styles from "./profile.module.css";
import { QuoteModal } from "./quote-modal/quote-modal";

export const Profile = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isQuoteModalVisible, setIsQuoteModalVisible] =
    useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [fullQuote, setFullQuote] = useState<string>("");

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
          setUserName(data.fullname);
        }

        setIsMounted(true);
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
    if (isMounted) {
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
      {userName && (
        <div className={styles.profileWrapper}>
          <Avatar size={130} icon={<UserOutlined />} />
          <div className={styles.profileInformation}>
            <h2 className={styles.header}>Welcome, {userName}</h2>
            <Button
              className="button"
              type="primary"
              onClick={() => setIsQuoteModalVisible(true)}
            >
              Update
            </Button>
          </div>
        </div>
      )}
      {fullQuote && <p>{fullQuote}</p>}
      <QuoteModal
        isQuoteModalVisible={isQuoteModalVisible}
        setIsQuoteModalVisible={setIsQuoteModalVisible}
        onQuoteFetched={(fullQuote) => setFullQuote(fullQuote)}
      />
    </>
  );
};
