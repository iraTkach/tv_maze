import React, { useEffect, useState } from "react";
import { apiUsers } from "./../../services/user.service";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

const Users = (props) => {
  const { title, onApiUsers } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    onApiUsers();
  }, [onApiUsers]);

  const dataSource = []?.map((user, idx) => ({
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

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />;
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    onApiUsers: () => {
      debugger
      dispatch({ type: "getUsers" });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
