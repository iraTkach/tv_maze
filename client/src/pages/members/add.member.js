import React, { useEffect } from "react";
import { Modal, Form, Input, Divider, Switch, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ContactsOutlined,
} from "@ant-design/icons";

const permissionProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
  xxl: 8,
};

export const AddMember = (props) => {
  const [form] = Form.useForm();
  const { fields, visible, onSave, onCancel, title, isEdit = false } = props;

  useEffect(() => {
    fields ? form.setFieldsValue(fields) : form?.resetFields();
  }, [form, fields]);

  return (
    <Modal
      visible={visible}
      title={title}
      okText={isEdit ? "Update" : "Add"}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onSave(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        //fields={fields}
        scrollToFirstError={true}
        initialValues={{
          abilities: {
            viewSub: true,
          },
        }}
      >
        <Form.Item
          name="name"
          label="Full Name"
          placeholder="Enter Full Name"
          rules={[
            {
              autoFocus: true,
              required: true,
              message: "Please input Full Name",
            },
          ]}
        >
          <Input
            prefix={<ContactsOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          placeholder="Enter Email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input Email",
            },
          ]}
        >
          <Input           
            autoComplete="email"
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="city"
          label="City"
          placeholder="Enter City"
          rules={[
            {
              required: true,
              message: "Please input City",
            },
          ]}
        >
          <Input
            autoComplete="city"
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
