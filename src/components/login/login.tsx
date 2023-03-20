import cn from 'classnames';
import { Button, Form, Input } from "antd";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useToken from "../../services/token.service";
import { User } from "../../types/types";
import { fetchLogin } from "../../services/api.service";
import styles from "./login.module.css";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [useForm] = Form.useForm();
  const navigate = useNavigate();
  const { setToken } = useToken();

  const login = useCallback(async (form: User) => {
    fetchLogin(form)
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
          className={cn(styles.formItem, styles.emailItem)}
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
          <Input name="email" placeholder="Enter email" size="large" />
        </Form.Item>
        <p className={styles.securityNote}>We'll never share your email with anyone else</p>
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
          <Input
            name="password"
            placeholder="Password"
            size="large"
            type="password"
          />
        </Form.Item>
        <Button className="button" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
      <ToastContainer />
    </>
  );
};
