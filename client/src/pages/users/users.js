import React, { useEffect, useState } from "react";
import { Button, Spin, Table, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "./../../models/actions/user.actions";
import { mainActions } from "./../../models/actions/main.actions";
import { AddUser } from "./add.user";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import styles from "./user.module.css";

const getButtons = (loading, onClick) => {
  return [
    <Button loading={loading} key="new" type="primary" onClick={onClick}>
      New
    </Button>,
  ];
};

const Users = (props) => {
  const {
    title,
    back,
    user,
    users = {},
    getAll,
    updateMeta,
    addAdminUser,
  } = props;

  useEffect(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    updateMeta(title, back, getButtons(users?.loading, handleAddNewUser));
  }, [users, back, title, updateMeta]);

  const handleAddNewUser = () => {
    setVisible(true);
  };

  const dataSource = users?.items?.map((user, idx) => ({
    key: idx,
    _id: user._id,
    userName: user.userName,
    name: user.name,
    createdAt: user.createdAt,
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Login",
      dataIndex: "userName",
      key: "userName",
      render(userName, data) {
        return <Link to={`/users/${data._id}`}>{userName}</Link>;
      },
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render(createdAt) {
        if (createdAt) {
          const _at = new Date(createdAt);
          return `${_at.toLocaleDateString()}, ${_at.toLocaleTimeString()}`;
        }
        return null;
      },
    },
    {
      title: "Actions",
      render(_, data) {
        return (
          <div className={styles.actions}>
            <EditOutlined onClick={() => alert("Edit")} />
            <Popconfirm
              title={`Are you sure to delete this user: ${data.userName}?`}
              onConfirm={() => {
                alert("Delete");
              }}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
    addAdminUser(values);
  };

  return (
    <Spin spinning={users?.loading}>
      <Table dataSource={dataSource} columns={columns} />
      <AddUser
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </Spin>
  );
};

function mapState(state) {
  const { user, users } = state;
  return { user, users };
}

const userCreators = {
  getAll: userActions.getAll,
  updateMeta: mainActions.updateMeta,
  addAdminUser: userActions.addAdminUser,
};

export default connect(mapState, userCreators)(Users);
