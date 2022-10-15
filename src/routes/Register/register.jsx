import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submit } from '@/features/sign/registerSlice';
import { Link } from 'react-router-dom';
import {
  Input,
  Button,
  Select,
  Row,
  Col,
  Popover,
  Progress,
  Layout,
  Form
} from 'antd';
import './index.less';
import '../Login/index.less';
import logoImg from '@/assets/images/logo1.png';
import Success from './Success';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
const { Content } = Layout;

const passwordStatusMap = {
  ok: <div style={{ color: '#52c41a' }}>强度：强</div>,
  pass: <div style={{ color: '#faad14' }}>强度：中</div>,
  poor: <div style={{ color: '#f5222d' }}>强度：太短</div>
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception'
};

// @connect(({ register, loading }) => ({
//   register,
//   submitting: loading.effects['register/submit']
// }))
const Register = props => {
  const dispatch = useDispatch();
  const loginState = useSelector(state => state.login);
  const { isLoading: submitting, status } = loginState;

  const [count, setCount] = useState(0);
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [visible, setVisible] = useState(false);
  const [help, setHelp] = useState('');
  const [prefix, setPrefix] = useState('86');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const intervalRef = useRef();
  const [form] = Form.useForm();

  if (status) {
    setRegisterSuccess(true);
  }

  useEffect(() => {
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  });

  const onGetCaptcha = () => {
    let count = 59;
    setCount(59);
    intervalRef.current = setInterval(() => {
      count -= 1;
      setCount(count);
      if (count === 0) {
        clearInterval(intervalRef.current);
      }
    }, 1000);
  };

  const getPasswordStatus = () => {
    if (!form) {
      return;
    }
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const handleSubmit = values => {
    dispatch(
      submit({
        ...values,
        prefix
      })
    );
  };

  const checkConfirm = (rule, value) => {
    if (value && value !== form.getFieldValue('password')) {
      setConfirmDirty(value);
      return Promise.reject('两次输入的密码不匹配!');
    } else {
      return Promise.resolve();
    }
  };

  const checkPassword = (rule, value) => {
    if (!value) {
      setVisible(!!value);
      return Promise.reject('请输入密码！');
    } else {
      setHelp('');
      if (!visible) {
        setVisible(!!value);
      }
      if (value.length < 6) {
        return Promise.reject('');
      } else {
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        return Promise.resolve();
      }
    }
  };

  const changePrefix = value => {
    setPrefix(value);
  };

  const renderPasswordProgress = () => {
    if (!form) {
      return;
    }
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <Progress
        status={passwordProgressMap[passwordStatus]}
        className={`progress-${passwordStatus}`}
        strokeWidth={6}
        percent={value.length * 10 > 100 ? 100 : value.length * 10}
        showInfo={false}
      />
    ) : null;
  };

  if (registerSuccess) {
    return <Success />;
  }
  return (
    <Layout className="full-layout register-page login-page">
      <Content>
        <Form form={form} onSubmit={handleSubmit} className="login-form">
          <div className="user-img">
            <img src={logoImg} alt="logo" />
            <b>LANIF</b>
            <span>Admin</span>
          </div>
          <Form.Item
            name="mail"
            rules={[
              {
                required: true,
                message: '请输入邮箱地址！'
              },
              {
                type: 'email',
                message: '邮箱地址格式错误！'
              }
            ]}
          >
            <Input size="large" placeholder="邮箱" />
          </Form.Item>
          <Form.Item>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              <Form.Item
                name="password"
                help={help}
                noStyle
                rules={[
                  {
                    validator: checkPassword
                  }
                ]}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder="至少6位密码，区分大小写"
                />
              </Form.Item>
            </Popover>
          </Form.Item>
          <Form.Item
            name="confirm"
            rules={[
              {
                required: true,
                message: '请确认密码！'
              },
              {
                validator: checkConfirm
              }
            ]}
          >
            <Input size="large" type="password" placeholder="确认密码" />
          </Form.Item>
          <Form.Item>
            <Input.Group compact>
              <Select
                size="large"
                value={prefix}
                onChange={changePrefix}
                style={{ width: '20%' }}
              >
                <Select.Option value="86">+86</Select.Option>
                <Select.Option value="87">+87</Select.Option>
              </Select>
              <Form.Item
                noStyle
                name="mobile"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！'
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！'
                  }
                ]}
              >
                <Input
                  size="large"
                  style={{ width: '80%' }}
                  placeholder="11位手机号"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Row gutter={8}>
              <Col span={16}>
                <Form.Item
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！'
                    }
                  ]}
                >
                  <Input size="large" placeholder="验证码" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button
                  className="getCaptcha"
                  size="large"
                  disabled={count}
                  onClick={onGetCaptcha}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              loading={submitting}
              className="register-form-button"
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className="fr" to="/sign/login">
              使用已有账户登录
            </Link>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default Register;
