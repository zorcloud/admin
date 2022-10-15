import './index.less';

import { Button, Checkbox, Form, Input, Layout, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/features/sign/loginSlice';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import logoImg from '@/assets/images/logo1.png';
import { useEffect } from 'react';
const { Content } = Layout;
const FormItem = Form.Item;

// @connect(({ login, loading }) => ({
//   login,
//   loading: loading.models.login
// }))
const Login = props => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.indexOf('/sign/login') !== -1) {
      localStorage.removeItem('user');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginState = useSelector(state => state.login);
  const { isLoading: loading } = loginState;
  const handleSubmit = async values => {
    const isSuccess = await dispatch(login(values));
    isSuccess && navigate('/');
  };

  return (
    <Layout className="full-layout login-page">
      <Content>
        <Spin tip="登录中..." spinning={!!loading}>
          <Form
            onFinish={handleSubmit}
            className="login-form"
            initialValues={{
              userName: 'admin',
              password: 'admin',
              remember: true
            }}
          >
            <div className="user-img">
              <img src={logoImg} alt="logo" />
              <b>LANIF</b>
              <span>Admin</span>
            </div>
            <FormItem
              name="userName"
              rules={[
                { required: true, message: '请输入您的用户名，示例admin' }
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="用户名"
              />
            </FormItem>
            <FormItem
              name="password"
              rules={[{ required: true, message: '请输入您的密码，示例admin' }]}
            >
              <Input
                size="large"
                prefix={<LockOutlined />}
                type="password"
                placeholder="密码"
              />
            </FormItem>
            <FormItem name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </FormItem>
            <Link className="login-form-forgot" to="#">
              忘记密码
            </Link>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
            <div className="new-user">
              新用户？<Link to="/sign/register">现在注册</Link>
            </div>
          </Form>
        </Spin>
      </Content>
    </Layout>
  );
};

export default Login;
