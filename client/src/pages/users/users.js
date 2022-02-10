import React, { useEffect, useState } from "react";
import { Button, Spin, Table, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "./../../models/actions/user.actions";
import { mainActions } from "./../../models/actions/main.actions";
import { AddUser } from "./add.user";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import styles from "./user.module.css";
import { sanitize } from "./../../utils/form";

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
    updateAdminUser,
    userPermissions,
  } = props;

  useEffect(() => {
    user && getAll();
  }, [getAll, user]);

  useEffect(() => {
    updateMeta(
      title,
      back,
      getButtons(users?.loading, () => handleAddNewUser("Add User"))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, back, title]);

  useEffect(() => {
    if (users.permissions) {
      const user = users.items.find(
        (user) => user._id === users.permissions._id
      );
      if (user) {
        Object.assign(user, users.permissions);
        setFields(user);
      } else {
        message.error("Unable to find selected user");
        setFields(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users?.permissions]);

  const handleAddNewUser = (_title) => {
    setVisible(true);
    setModalTitle(_title);
    setIsEdit(false);
    setFields(null);
  };

  const handleEditUser = (_title, user) => {
    setVisible(true);
    setModalTitle(_title);
    setIsEdit(true);
    setFields(user);
    userPermissions(user, users);
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
            <EditOutlined
              onClick={() => {
                handleEditUser("Edit User", data);
              }}
            />
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

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
    addAdminUser(sanitize(values));
  };

  const onUpdate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
    updateAdminUser(fields._id, sanitize(values));
  };

  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add User");
  const [isEdit, setIsEdit] = useState(false);
  const [fields, setFields] = useState(null);

  return (
    <Spin spinning={users?.loading}>
      <Table dataSource={dataSource} columns={columns} />
      {visible && (
        <AddUser
          fields={fields}
          title={modalTitle}
          visible={visible}
          isEdit={isEdit}
          onSave={(values) => (isEdit ? onUpdate(values) : onCreate(values))}
          onCancel={() => {
            setVisible(false);
          }}
        />
      )}
    </Spin>
  );
};

function mapState(state) {
  const { users } = state;
  return { users };
}

const userCreators = {
  getAll: userActions.getAll,
  updateMeta: mainActions.updateMeta,
  addAdminUser: userActions.addAdminUser,
  updateAdminUser: userActions.updateAdminUser,
  userPermissions: userActions.userPermissions,
};

export default connect(mapState, userCreators)(Users);
