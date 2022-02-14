import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Modal,
  Form,
  Input,
  Divider,
  Switch,
  Row,
  Col,
  DatePicker,
  Select,
} from "antd";

import { CameraOutlined, ContactsOutlined } from "@ant-design/icons";

import styles from "./subscription.module.css";

const { Option } = Select;

export const AddSubscription = (props) => {
  const [form] = Form.useForm();
  const {
    fields,
    movies=[],
    visible,
    onSave,
    onCancel,
    title,
    isEdit = false,
  } = props;

  useEffect(() => {
    if (fields) {
      const _field = { ...fields };
      _field.subscribedAt = moment(_field.subscribedAt);
      form?.setFieldsValue(_field);
    } else {
      form?.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, fields]);

  return (
    <Modal
      className={styles.subForm}
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
            values.subscribedAt = new Date(
              values.subscribedAt.format("YYYY-MM-DD")
            );
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
          name="movieId"
          label="Movie"
          rules={[
            {
              required: true,
              message: "Please select Movie",
            },
          ]}
        >
          <Select
            placeholder="Select Movie"
            allowClear
            style={{ width: "100%" }}
          >
            {movies.map((movie) => (
              <Option key={movie._id}>
                {movie.name}
              </Option>
            ))}
          </Select>
        </Form.Item>        
        <Row>
          <Col span={12}>
            <Form.Item
              name="subscribedAt"
              label="Subscribe at"
              rules={[
                {
                  required: true,
                  message: "Please select Subscribe at",
                },
              ]}
            >
              <DatePicker placeholder="Enter Subscribe at" />
            </Form.Item>
          </Col>          
        </Row>
      </Form>
    </Modal>
  );
};
