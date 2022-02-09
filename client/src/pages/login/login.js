import React, { useEffect } from "react";
import { Input, Form, Button } from "antd";
import { connect } from "react-redux";
import { mainActions } from "./../../models/actions/main.actions";
import { userActions } from "./../../models/actions/user.actions";

import styles from './login.module.css';

const Login = (props) => {
  const { title, updateMeta, login } = props;

  const onFinish = (values) => {
    console.log("Success:", values);
    login(values);
  };

  const userJson = window.localStorage.getItem("user");
  let user = null;

  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch(e) {
      console.error(e);   
    }
  }

  useEffect(() => {
    updateMeta(title);
  }, [title, updateMeta]);

  useEffect(()=> {
    if (user) {
      window.location.replace("/");
    }
  }, [user]);

  return user ? null : (
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
      <Form.Item
        label="Username"
        placeholder="Enter User Name"
        name={["user","username"]}
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
        label="Password"
        placeholder="Password"
        name={["user","password"]}
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
        <Button type="primary" htmlType="submit">
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
};

function mapState(state) {
  return { ...state };
}

const homeCreators = {
  updateMeta: mainActions.updateMeta,
  login: userActions.login,
};

export default connect(mapState, homeCreators)(Login);
