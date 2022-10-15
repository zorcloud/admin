// import 'antd/dist/antd.less';
// import './style/index.less';
import './assets/styles/index.less';
import '@ant-design/compatible/assets/index.css';
// 添加 mock 数据
import './_mock';

import App from './App';
// import App from './layouts/Basic';
// Provider在App外统一给所有容器组件添加store(避免频繁的加)
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
// import axios from './http';
import { store } from './app/store';
import { BrowserRouter as Router } from 'react-router-dom';

// window.axios = axios;
// 路由映射表
// window.dva_router_pathMap = {};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  // </React.StrictMode>
);

// redux状态变化不会引起页面渲染，而react-redux有自带的
/* store.subscribe(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})
*/
