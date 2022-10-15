import React from 'react';

import { Layout } from 'antd';
import useBase from '@/hooks/useBase';
const { Content } = Layout;

const Index = props => {
  const base = useBase();
  return (
    <Layout className="full-layout page blank-page">
      <Content>详情页</Content>
    </Layout>
  );
};
export default Index;
