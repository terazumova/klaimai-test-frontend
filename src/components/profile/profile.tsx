import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    axios
      .get(`${process.env.REACT_APP_PUBLIC_API_URL}/profile`, {
        params: {
          token,
        },
      })
      .then(({ data: response }) => {
        const result = response.data;

        if (result.fullname) {
          setUserName(result.fullname);
        }

        setIsMounted(true);
      });
  };

  const logout = () => {
    axios
      .delete(`${process.env.REACT_APP_PUBLIC_API_URL}/logout`, {
        params: {
          token,
        },
      })
      .then(({ data: response }) => {
        if (response?.success) {
          setToken("");
          navigate("/");
        }
      });
  };

  useEffect(() => {
    if (isMounted) {
      return;
    }

    fetchProfileInformation();
  }, []);

  return (
    <>
      <h1 className="hidden">Profile</h1>
      <Button className={styles.button} onClick={() => navigate("/")}>
        About us
      </Button>
      <Button className={styles.button} type="primary">
        Profile
      </Button>
      <Button className={styles.button} onClick={() => logout()}>
        Sign out
      </Button>
      {userName && (
        <div className={styles.profileWrapper}>
          <Avatar size={170} icon={<UserOutlined />} />
          <div className={styles.profileInformation}>
            <h2 className={styles.header}>Welcome, {userName}</h2>
            <Button
              className={styles.button}
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
