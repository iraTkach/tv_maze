import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "./../../models/actions/user.actions";
import { mainActions } from "./../../models/actions/main.actions";
import { AddUser } from "./add.user";

const Users = (props) => {
  const { title, back, user, users = {}, getAll, updateMeta } = props;

  useEffect(() => {
    const buttons = [
      <Button key="new" type="primary" onClick={handleAddNewUser}>
        New
      </Button>,
    ];

    getAll();
    updateMeta(title, back, buttons);
  }, [back, getAll, title, updateMeta]);

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
  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />;
      <AddUser
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

function mapState(state) {
  const { user, users } = state;
  return { user, users };
}

const userCreators = {
  getAll: userActions.getAll,
  updateMeta: mainActions.updateMeta,
};

export default connect(mapState, userCreators)(Users);
