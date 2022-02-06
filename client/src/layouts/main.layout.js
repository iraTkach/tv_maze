import React, { useState } from "react";
import "antd/dist/antd.min.css";
import { Layout, PageHeader } from "antd";
import { Outlet } from "react-router-dom";
import LayoutMeta from ".";
import { Provider } from "react-redux";
import { store } from "../models/store";
import { connect } from "react-redux";
import { mainActions } from "./../models/actions/main.actions";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = (props) => {
  const { metadata = {} } = props;

  const [collapsed, setCollapsed] = useState(true);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Provider store={store}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className={"logo"} />
          <LayoutMeta.Menu />
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <LayoutMeta.Breadcrumbs />
            {alert?.message && (
              <div className={`alert ${alert.type}`}>{alert.message}</div>
            )}
            <PageHeader
              ghost={false}
              onBack={metadata?.back ? () => window.history.back() : null}
              title={metadata?.title}            
              extra={metadata?.buttons}
            >
              <Outlet />
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
