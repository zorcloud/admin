import { notification } from 'antd';
import { isObject } from '@/utils';
// import Notification from './Notification';
import './antdNotice.less';

const prefixCls = 'antui-notification';
const defaultConfig = {};

function notice(config, type, title) {
  if (isObject(config)) {
    notification[type]({
      className: `${prefixCls} ${prefixCls}-${type}`,
      ...defaultConfig,
      ...config
    });
  } else {
    notification[type]({
      className: `${prefixCls} ${prefixCls}-${type}`,
      message: title,
      description: config,
      ...defaultConfig
    });
  }
}

const Notification = () => {};
Notification.success = config => {
  notice(config, 'success', '成功');
};

Notification.error = config => {
  notice(config, 'error', '出错了');
};

Notification.info = config => {
  notice(config, 'info', '提示');
};

Notification.warning = config => {
  notice(config, 'warning', '注意');
};

Notification.warn = config => {
  notice(config, 'warning', '注意');
};

Notification.close = key => {
  notification.close(key);
};

Notification.destroy = () => {
  notification.destroy();
};

export default Notification;
