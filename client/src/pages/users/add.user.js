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

export const AddUser = (props) => {
  const [form] = Form.useForm();
  const { fields, visible, onSave, onCancel, title, isEdit = false } = props;

  useEffect(() => {
    fields ? form.setFieldsValue(fields) : form?.resetFields();
  }, [form, fields]);

  const prmOpts = [
    { label: "View Subscriptions", value: "viewSub" },
    { label: "Create Subscriptions", value: "createSub" },
    { label: "View Movie", value: "viewMovie" },
    { label: "Create Movie", value: "createMovie" },
    { label: "Delete Movie", value: "deleteMovie" },
    { label: "Update Movie", value: "updateMovie" },
  ];

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
              message: "Please input your Full Name",
            },
          ]}
        >
          <Input
            prefix={<ContactsOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="userName"
          label="User Name"
          placeholder="Enter User Name"
          rules={[
            {
              required: true,
              message: "Please input your Username",
            },
          ]}
        >
          <Input
            disabled={isEdit}
            autoComplete="username"
            prefix={<UserOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            placeholder="Enter Password"
            rules={[
              {
                required: true,
                message: "Please input your Password",
              },
            ]}
          >
            <Input
              autoComplete="current-password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
            />
          </Form.Item>
        )}
        <Divider orientation="left">Permissions</Divider>
        <Row gutter={[16, 16]}>
          {prmOpts.map((p, idx) => (
            <Col {...permissionProps} key={idx}>
              <Form.Item
                name={["abilities", p.value]}
                label={p.label}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};
