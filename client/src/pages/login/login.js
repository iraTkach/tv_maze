import React, { useEffect } from "react";
import { Input, Form, Button } from "antd";
import { connect } from "react-redux";
import { mainActions } from "./../../models/actions/main.actions";

const Login = (props) => {
  const { title, updateMeta } = props;

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  useEffect(() => {
    updateMeta(title);
  }, [title, updateMeta]);

  return (
    <Form
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
        name="username"
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
        name="password"
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
};

export default connect(mapState, homeCreators)(Login);
