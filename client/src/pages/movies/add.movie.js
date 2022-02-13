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

import styles from "./movies.module.css";

const { Option } = Select;

const LIMIT_GENRES = 3;

export const AddMovie = (props) => {
  const [form] = Form.useForm();
  const { fields, visible, onSave, onCancel, title, isEdit = false } = props;

  const [imgUrl, setImgUrl] = useState(null);
  const [imgAlt, setImgAlt] = useState(null);

  useEffect(() => {
    if (fields) {
      const _field = { ...fields };
      _field.premiered = moment(_field.premiered);
      form?.setFieldsValue(_field);
      setImgUrl(form?.getFieldValue("image"));
      setImgAlt(form?.getFieldValue("name"));      
      limitGenres(_field.genres);
    } else {
      form?.resetFields();
      optFields();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, fields]);

  const updateThumbnail = e => {
    const url = e.target.value;
    setImgUrl(url);
    setImgAlt(form?.getFieldValue("name"));
  }

  const genresOpts = [
    "Drama",
    "Science-Fiction",
    "Action",
    "Crime",
    "Horror",
    "Romance",
    "Adventure",
    "Thriller",
    "Music",
    "Espionage",
  ];

  const [genres, setGenres] = useState([]);

  const optFields = (selectedGenres = []) => {
    const _genres = [];
    let disabled = false;
    for (let i = 0, l = genresOpts.length; i < l; i++) {
      console.log()
      if (selectedGenres.length >= LIMIT_GENRES) {        
        if (selectedGenres.includes(genresOpts[i])) {
          disabled = false;
        } else {
          disabled = true;
        }
      } else {
        disabled = false;
      }

      _genres.push(
        <Option key={genresOpts[i]} disabled={disabled}>
          {genresOpts[i]}
        </Option>
      );
    }

    setGenres(_genres);
  };

  const limitGenres = (values) => {    
    optFields(values);
  };

  return (
    <Modal
      className={styles.movieForm}
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
            values.premiered = new Date(values.premiered.format('YYYY-MM-DD'));
            setImgUrl(null);
            setImgAlt(null);
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
          label="Name"
          rules={[
            {
              autoFocus: true,
              required: true,
              message: "Please input Name",
            },
          ]}
        >
          <Input
            placeholder="Enter Name"
            prefix={<ContactsOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Form.Item
          name="genres"
          label="Genres"
          rules={[
            {
              required: true,
              message: "Please select Genres",
              type: "array",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select Genres"
            allowClear
            style={{ width: "100%" }}
            onChange={limitGenres}
          >
            {genres}
          </Select>
        </Form.Item>
        <Form.Item
          name="image"
          label="Image Url"
          rules={[
            {
              required: true,
              message: "Please input Image Url",
            },
          ]}
        >
          <Input
          onBlur={updateThumbnail}
            placeholder="Enter Image Url"
            prefix={<CameraOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item      
              name="premiered"
              label="Premiered Date"
              rules={[
                {
                  required: true,
                  message: "Please input Film Premiered Date",
                },
              ]}
            >
              <DatePicker placeholder="Enter Premiered Date" />
            </Form.Item>
          </Col>
          {imgUrl && (
            <Col span={12}>
              <Form.Item label="Movie Thumbnail">
                <img src={imgUrl} alt={imgAlt} />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};
