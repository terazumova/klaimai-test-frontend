import { Button, Form, Input } from "antd";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { API_URL } from "../../constants";
import useToken from "../../services/token.service";
import styles from "./login.module.css";
import 'react-toastify/dist/ReactToastify.css';

interface User {
  email: string;
  password: string;
}

export const Login = () => {
  const [useForm] = Form.useForm();
  const navigate = useNavigate();
  const { setToken } = useToken();

  const login = useCallback(async (form: User) => {
    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        const { success, data } = result;

        if (!success) {
          toast.error(data?.message);
          return;
        }

        if (data?.token) {
          setToken(data.token);
          navigate("/profile");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    document.title = "Sign in";
  }, []);

  return (
    <>
      <h1 className="hidden">Sign in</h1>
      <Button className="button" onClick={() => navigate("/")}>
        About us
      </Button>
      <Button className="button" type="primary">
        Sign in
      </Button>
      <Form
        name="login"
        layout="vertical"
        form={useForm}
        onFinish={login}
        className={styles.form}
      >
        <Form.Item
          id="email"
          name="email"
          className={styles.formItem}
          rules={[
            {
              required: true,
              message: "Please input email",
            },
            {
              type: "email",
              message: "Invalid email address",
            },
          ]}
          label="Email address"
        >
          <Input placeholder="Enter email" size="large" />
        </Form.Item>
        <Form.Item
          id="password"
          name="password"
          className={styles.formItem}
          rules={[
            {
              required: true,
              message: "Please input password",
            },
          ]}
          label="Password"
        >
          <Input placeholder="Password" size="large" type="password" />
        </Form.Item>
        <Button className="button" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
      <ToastContainer />
    </>
  );
};
