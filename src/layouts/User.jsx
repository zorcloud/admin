import './styles/user.less';
import React from 'react';
import { Layout } from 'antd';
import { Outlet, Routes } from 'react-router-dom';
const { Content } = Layout;
const UserLayout = props => {
  return (
    <Layout className="full-layout user-layout fixed">
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};
export default UserLayout;
