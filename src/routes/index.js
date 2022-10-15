// import Home from './Home';
import React, { Suspense } from 'react';

import { Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Basic from '../layouts/Basic';
import Sign from '../layouts/User';
import CSSAnimate from './ui/CSSAnimate';
import Button from './ui/Button';
import User from './User';
import UserDetail from './User/Detail';

const routes = [
  {
    path: '/',
    element: <Navigate to="/button" />
  },
  {
    path: '/',
    element: <Basic />,
    children: [
      // {
      //   path: 'home',
      //   element: <Home />
      // },
      {
        path: 'button',
        element: <Button />
      },
      {
        path: 'animate',
        element: <CSSAnimate />
      },
      {
        path: 'user',
        element: <User />
      },
      {
        path: 'user/detail',
        element: <UserDetail />
      }
    ]
  },
  {
    path: '/sign',
    element: <Navigate to="/sign/login" />
  },
  {
    path: '/sign',
    element: <Sign />,
    children: [
      {
        path: 'login',
        index: true,
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      }
    ]
  }
];

window.dva_router_pathMap = {
  // '/': {
  //   path: '/',
  //   title: '主页',
  // childRoutes: [
  '/': {
    path: '/',
    key: '/',
    title: '主页'
  },
  '/user': {
    path: '/user',
    key: '/user',
    title: '用户'
  },
  '/button': {
    path: '/button',
    key: '/button',
    title: '按钮'
  },
  '/animate': {
    path: '/animate',
    key: '/animate',
    title: 'css动画'
  }
  // ]
  // }
};

export default routes;
