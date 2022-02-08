import React, { useState } from "react";
import "antd/dist/antd.min.css";
import { Button, Layout, PageHeader } from "antd";
import { Outlet } from "react-router-dom";
import LayoutMeta from ".";
import { Provider } from "react-redux";
import { store } from "../models/store";
import { connect } from "react-redux";
import { mainActions } from "./../models/actions/main.actions";
import Login from "../pages/login";

import styles from "./layout.module.css";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = (props) => {
  const { metadata = {} } = props;

  const [collapsed, setCollapsed] = useState(true);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  // TODO (Ira Tkach): Create redux call to check if user is
  // available and loggedin in the system.
  const isLoggedIn = window.sessionStorage.getItem("user");

  // useEffect(() => {

  // }, [isLoggedIn]);

  return (
    <Provider store={store}>
      <Layout style={{ minHeight: "100vh" }}>
        {isLoggedIn && (
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className={"logo"} />
            <LayoutMeta.Menu />
          </Sider>
        )}
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
          <div className={styles.slogan}>TVMaze</div>
            <div className={styles.user}>
              <div>{isLoggedIn ? "" : "Welcome Guest"}</div>
              <div>
                {isLoggedIn && <Button type="primary">Logout</Button>}
              </div>
            </div>
          </Header>
          <Content style={{ margin: isLoggedIn ? "0 16px" : 30 }}>
            {isLoggedIn && <LayoutMeta.Breadcrumbs />}
            {alert?.message && (
              <div className={`alert ${alert.type}`}>{alert.message}</div>
            )}
            <PageHeader
              ghost={false}
              onBack={metadata?.back ? () => window.history.back() : null}
              title={metadata?.title}
              extra={metadata?.buttons}
            >
              {isLoggedIn ? <Outlet /> : <Login />}
            </PageHeader>
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
};

export default connect(mapState, layoutCreators)(MainLayout);
