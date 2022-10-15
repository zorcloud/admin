import React, { useEffect, useState, useRef } from 'react';
import { isObject } from '@/utils';
import pubsub from 'pubsub-js';
import ReactDOM from 'react-dom/client';
// import Notification from './Notification';
import './normal.less';
const SHOW_NOTICE = 'SHOW_NOTICE';
const HIDE_NOTICE = 'HIDE_NOTICE';

function notice(config, type = 'default') {
  pubsub.publish(SHOW_NOTICE, { type, config });
  return hide;
}

function hide() {
  pubsub.publish(HIDE_NOTICE);
}

/**
 * 通知条示例
 * 使用 pubsub 发布订阅
 * 的在全局范围内，打开关闭通知条
 */
const Normal = () => {
  const [active, setActive] = useState(false);
  const [type, setType] = useState('default');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const timer = useRef();

  useEffect(() => {
    pubsub.subscribe(SHOW_NOTICE, showNotice);
    pubsub.subscribe(HIDE_NOTICE, hideNotice);

    return () => {
      pubsub.unsubscribe(SHOW_NOTICE);
      pubsub.unsubscribe(HIDE_NOTICE);
    };
  });

  const showNotice = (tagName, { config, type }) => {
    setActive(true);
    setMessage(config.message);
    setTitle(config.title || '提示：');
    setType(type);

    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    timer.current = setTimeout(hideNotice, 3000);
  };

  const hideNotice = () => {
    setActive(false);
  };

  return (
    <div className={`la-notification${active ? ' active' : ''}`}>
      <div className={`content ${type}`}>
        {title} {message}
      </div>
      <span className="close" onClick={hideNotice} />
    </div>
  );
};

const Notification = props => {};
Notification.success = config => {
  if (isObject(config)) {
    notice(config, 'success');
  } else {
    notice(
      {
        title: '成功：',
        message: config
      },
      'success'
    );
  }
};

Notification.error = config => {
  if (isObject(config)) {
    notice(config, 'error');
  } else {
    notice(
      {
        title: '出错了：',
        message: config
      },
      'error'
    );
  }
};

Notification.info = config => {
  if (isObject(config)) {
    notice(config);
  } else {
    notice({
      message: config
    });
  }
};

Notification.warning = config => {
  if (isObject(config)) {
    notice(config, 'warn');
  } else {
    notice(
      {
        title: '注意：',
        message: config
      },
      'warn'
    );
  }
};

Notification.warn = config => {
  if (isObject(config)) {
    notice(config, 'warn');
  } else {
    notice(
      {
        title: '注意：',
        message: config
      },
      'warn'
    );
  }
};

Notification.close = key => {
  /* 关闭 */
};

Notification.destroy = () => {
  /* 销毁 */
};
export default Notification;
const container = document.createElement('div');
const cDom = document.body.appendChild(container);
const cRoot = ReactDOM.createRoot(cDom);
cRoot.render(<Normal />);
// cDom.appendChild(<Normal />)
