import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css";
import { Button, Layout, PageHeader } from "antd";
import { Outlet } from "react-router-dom";
import LayoutMeta from ".";
import { Provider } from "react-redux";
import { store } from "../models/store";
import { connect } from "react-redux";
import { mainActions } from "./../models/actions/main.actions";
import { userActions } from "./../models/actions/user.actions";

import styles from "./layout.module.css";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = (props) => {
  const { metadata = {}, logout, user } = props;

  const [collapsed, setCollapsed] = useState(true);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  useEffect(() => {
    const { location } = window;
    const isLogin = location.href.match(/login/);
    const isRegister = location.href.match(/register/);

    if (!user) {
      if (isLogin || isRegister) {
        // Do nothing.
      } else {
        window.location.replace("/login");
      }
    }
  }, [user]);

  // useEffect(() => {

  // }, [isLoggedIn]);

  return (
    <Provider store={store}>
      <Layout style={{ minHeight: "100vh" }}>
        {user && (
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className={"logo"} />
            <LayoutMeta.Menu />
          </Sider>
        )}
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <div className={styles.slogan}>TVMaze</div>
            <div className={styles.user}>
              <div>Welcome, {user ? user.name : "Guest"}</div>
              <div>
                {user && (
                  <Button type="primary" onClick={logout}>
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </Header>
          <Content style={{ margin: user ? "0 16px" : 30, padding: '20px 0' }}>
            {user && (
              <PageHeader
                ghost={false}
                onBack={metadata?.back ? () => window.history.back() : null}
                title={metadata?.title}
                extra={metadata?.buttons}
              />
            )}
            <Outlet/>
          </Content>
          <Footer style={{ textAlign: "center" }}>TVMaze</Footer>
        </Layout>
      </Layout>
    </Provider>
  );
};

function mapState(state) {
  const { metadata } = state;
  return { metadata };
}

const layoutCreators = {
  updateMeta: mainActions.updateMeta,
  logout: userActions.logout,
};

export default connect(mapState, layoutCreators)(MainLayout);
