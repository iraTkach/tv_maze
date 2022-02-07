import React, { useEffect, useState } from "react";
import { Button, Spin, Table } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "./../../models/actions/user.actions";
import { mainActions } from "./../../models/actions/main.actions";
import { AddUser } from "./add.user";

const getButtons = (loading, onClick) => {
  return [
    <Button loading={loading} key="new" type="primary" onClick={onClick}>
      New
    </Button>,
  ];
};

const Users = (props) => {
  const { title, back, user, users = {}, getAll, updateMeta, addAdminUser } = props;

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
    name: user.userName,
  }));

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render(name, data) {
        return <Link to={`/users/${data._id}`}>{name}</Link>;
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
