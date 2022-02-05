import React from "react";
import { Menu } from "antd";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const LayoutMenu = (props) => {
  return (
    <Menu theme={"dark"} defaultSelectedKeys={["home"]} mode={"inline"}>
      <Menu.Item key={"home"} icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key={"users"} icon={<UserOutlined />}>
        <Link to="/users">Users</Link>
      </Menu.Item>
    </Menu>
  );
};

export default LayoutMenu;
