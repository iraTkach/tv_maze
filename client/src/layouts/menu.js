import React from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const LayoutMenu = (props) => {
  const { user } = props;

  return (
    <Menu theme={"dark"} defaultSelectedKeys={["movies"]} mode={"inline"}>
      <Menu.Item key={"movies"} icon={<VideoCameraOutlined />}>
        <Link to="/">Movies</Link>
      </Menu.Item>

      {user.isAdmin && (
        <Menu.Item key={"users"} icon={<UserOutlined />}>
          <Link to="/users">User Management</Link>
        </Menu.Item>
      )}
      <Menu.Item key={"members"} icon={<UsergroupAddOutlined />}>
        <Link to="/members">Subscribers</Link>
      </Menu.Item>
    </Menu>
  );
};

export default LayoutMenu;
