import React, { useState } from "react";
import "antd/dist/antd.min.css";
import { Button, Layout, PageHeader } from "antd";
import { Outlet } from "react-router-dom";
import LayoutMeta from ".";
import { Provider } from "react-redux";
import { createStore } from 'redux';
import commonModel from "./../models/common.model";

const { Header, Content, Footer, Sider } = Layout;

const MainLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const store = createStore(commonModel);
console.log(store);
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
            <PageHeader
              ghost={false}
              onBack={() => window.history.back()}
              title="Title"
              subTitle="This is a subtitle"
              extra={[
                <Button key="1" type="primary">
                  Primary
                </Button>,
              ]}
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

export default MainLayout;
