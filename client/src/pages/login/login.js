import React, { useEffect } from "react";
import { Input, Form, Button } from "antd";
import { connect } from "react-redux";
import { mainActions } from "./../../models/actions/main.actions";
import { userActions } from "./../../models/actions/user.actions";
import { alertActions } from "./../../models/actions/alert.actions";
import { Link } from "react-router-dom";

import styles from "./login.module.css";

const Login = (props) => {
  const { user, title, updateMeta, login, register, isRegister = false } = props;

  const onFinish = (values) => {
    console.log("Success:", values);
    isRegister ? register(values) : login(values);
  };

  useEffect(() => {
    updateMeta(title);
  }, [title, updateMeta]);

  useEffect(() => {
    if (user) {
      window.location.replace("/");
    }
  }, [user]);

  return user ? null : (
    <div>
      <Form
        className={styles.login}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h1>{isRegister ? "Register" : "Login"}</h1>
        {isRegister && (
          <Form.Item
            label="Full Name"
            placeholder="Enter Full Name"
            name={["user", "name"]}
            rules={[
              {
                required: true,
                message: "Please input your Full Name",
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          label="Username"
          placeholder="Enter User Name"
          name={["user", "username"]}
          rules={[
            {
              required: true,
              message: "Please input your User Name",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={isRegister ? "New Password" : "Password"}
          placeholder="Password"
          name={["user", "password"]}
          rules={[
            {
              required: true,
              message: "Please input your Password",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          {isRegister ? (
            <div className={styles.button}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
              <Link to="/login">Sign In</Link>
            </div>
          ) : (
            <div className={styles.button}>
              <Button type="primary" htmlType="submit">
                Sign In
              </Button>
              <Link to="/register">Register</Link>
            </div>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

function mapState(state) {
  return { ...state };
}

const homeCreators = {
  error: alertActions.error,
  updateMeta: mainActions.updateMeta,
  login: userActions.login,
  registration: userActions.registration,
};

export default connect(mapState, homeCreators)(Login);
