import React, { useEffect, useState, Suspense } from 'react';
import { Layout } from 'antd';
import { getMenu, selectGlobal } from '@/features/globalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

import NavBar from '@/components/NavBar';
import { LeftSideBar, RightSideBar } from '@/components/SideBar';
import TopBar from '@/components/TopBar';
import SkinToolbox from '@/components/SkinToolbox';

import pathToRegexp from 'path-to-regexp';
import { enquireIsMobile } from '@/utils/enquireScreen';
// import TabsLayout from './TabsLayout';
import cx from 'classnames';
// import { SwitchTransition, CSSTransition } from 'react-transition-group';
import '@/assets/styles/transition.less';
import './styles/basic.less';
import { isArray } from '../utils';
const { Content, Header } = Layout;

/**
 * 基本部局
 * 可设置多种皮肤 theme: [light, grey, primary, info, warning, danger, alert, system, success, dark]
 * 可设置多种布局 [header(固定头), sidebar(固定边栏), breadcrumb(固定面包蟹), tabLayout(标签布局)]
 * @author tzq1476
 */
// @connect(({ global }) => ({ global }))
const Basic = props => {
  const navigate = useNavigate();
  const [collapsedLeftSide, setCollapsedLeftSide] = useState(false); // 左边栏开关控制
  const [leftCollapsedWidth, setLeftCollapsedWidth] = useState(60); // 左边栏宽度
  const [expandTopBar, setExpandTopBar] = useState(false); // 头部多功能区开合
  const [showSidebarHeader, setShowSidebarHeader] = useState(false); // 左边栏头部开关
  const [collapsedRightSide, setCollapsedRightSide] = useState(true); // 右边栏开关
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem('theme')) || {
      leftSide: 'dark', // 左边
      navbar: 'light' // 顶部
    }
  ); // 皮肤设置

  // 测试数据
  // localStorage.setItem(
  //   'user',
  //   `{"userName":"admin","name":"金刚","age":47,"birthday":"1987-05-25","city":"台湾 南投县","phone":"15748638447","token":"73d1ED22-AD3E-F0Bf-f35F-dE0Cf73E44cf"}`
  // );
  const userStore = localStorage.getItem('user');
  const [user, setUser] = useState(JSON.parse(userStore) || {});
  const [currentMenu, setCurrentMenu] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  localStorage.setItem('theme', JSON.stringify(theme));

  if (!theme.layout) {
    setTheme({
      ...theme,
      layout: [
        'fixedHeader',
        'fixedSidebar',
        'fixedBreadcrumbs'
        // 'hidedBreadcrumbs',
        // 'tabLayout',
      ]
    });
  }

  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  const location = useLocation();

  const getMeunMatchKeys = (flatMenu, path) => {
    return flatMenu.filter(item => {
      return pathToRegexp(item.path).test(path);
    });
  };

  // 检查有户是否登录
  const checkLoginState = () => {
    if (!userStore) {
      navigate('/sign/login', { replace: true });
    }
  };

  useEffect(() => {
    checkLoginState();
    dispatch(getMenu());
    setCurrentMenu(getMeunMatchKeys(global.flatMenu, location.pathname) || {});

    // 是否移动端
    const unregisterEnquire = enquireIsMobile(ismobile => {
      if (isMobile !== ismobile) {
        // 如查是移动端则不固定侧边栏
        if (ismobile && isArray(theme.layout)) {
          theme.layout = theme.layout.filter(item => item !== 'fixedSidebar');
        }
        setIsMobile(ismobile);
      }
    });
    return () => {
      // 清理监听
      unregisterEnquire();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, location.pathname, theme]);

  /**
   * 顶部左侧菜单图标收缩控制
   */
  const onCollapseLeftSide = _ => {
    const newCollapsedLeftSide =
      leftCollapsedWidth === 0 ? true : !collapsedLeftSide;
    setCollapsedLeftSide(newCollapsedLeftSide);
    setCollapsedRightSide(collapsedRightSide || !newCollapsedLeftSide);
  };

  /**
   * 完全关闭左边栏，即宽为0
   */
  const onCollapseLeftSideAll = _ => {
    setCollapsedLeftSide(true);
    setLeftCollapsedWidth(0);
  };

  /**
   * 展开面包屑所在条中的多功能区
   */
  const onExpandTopBar = _ => {
    setExpandTopBar(true);
  };

  /**
   * 与上面相反
   */
  const onCollapseTopBar = _ => {
    setExpandTopBar(false);
  };

  /**
   * 切换左边栏中头部的开合
   */
  const toggleSidebarHeader = _ => {
    setShowSidebarHeader(!showSidebarHeader);
  };

  /**
   * 切换右边栏
   */
  const toggleRightSide = _ => {
    setCollapsedLeftSide(collapsedRightSide ? true : collapsedLeftSide);
    setCollapsedRightSide(!collapsedRightSide);
  };

  const onChangeTheme = theme => {
    localStorage.setItem('theme', JSON.stringify(theme));
    setTheme(theme);
  };

  const classnames = cx('basic-layout', 'full-layout', {
    fixed: theme.layout && theme.layout.indexOf('fixedSidebar') !== -1,
    'fixed-header': theme.layout && theme.layout.indexOf('fixedHeader') !== -1,
    'fixed-breadcrumbs':
      theme.layout && theme.layout.indexOf('fixedBreadcrumbs') !== -1,
    'hided-breadcrumbs':
      theme.layout && theme.layout.indexOf('hidedBreadcrumbs') !== -1
  });

  return (
    <Layout className={classnames}>
      <Header>
        <NavBar
          collapsed={collapsedLeftSide}
          onCollapseLeftSide={onCollapseLeftSide}
          onExpandTopBar={onExpandTopBar}
          toggleSidebarHeader={toggleSidebarHeader}
          theme={theme.navbar}
          user={user}
          isMobile={isMobile}
        />
      </Header>
      <Layout>
        <LeftSideBar
          collapsed={collapsedLeftSide}
          leftCollapsedWidth={leftCollapsedWidth}
          showHeader={showSidebarHeader}
          onCollapse={onCollapseLeftSide}
          onCollapseAll={onCollapseLeftSideAll}
          location={location}
          theme={theme.leftSide}
          flatMenu={global.flatMenu}
          currentMenu={currentMenu}
          menu={global.menu}
          user={user}
          isMobile={isMobile}
        />
        <Content>
          {/* {theme.layout.indexOf('tabLayout') >= 0 ? (
            <TabsLayout childRoutes={element} location={location} />
          ) :
          ( */}
          <Layout className="full-layout">
            <Header>
              <TopBar
                expand={expandTopBar}
                toggleRightSide={toggleRightSide}
                collapsedRightSide={collapsedRightSide}
                onCollapse={onCollapseTopBar}
                currentMenu={currentMenu}
                location={location}
                theme={theme}
              />
            </Header>
            <Content style={{ overflow: 'hidden' }}>
              {/* <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  classNames="fade"
                  timeout={500}
                > */}
              <Layout className="full-layout">
                <Content className="router-page">
                  {/* <Routes location={location}>
                        <Route path="animate" element={<CSSAnimate />}></Route>
                      </Routes> */}
                  {/* <Suspense fallback={<div>Loading...</div>}> */}
                  <Outlet location={location} />
                  {/* </Suspense> */}
                </Content>
              </Layout>
              {/* </CSSTransition>
              </SwitchTransition> */}
            </Content>
          </Layout>
          {/* )} */}
        </Content>
        <RightSideBar
          collapsed={collapsedRightSide}
          isMobile={isMobile}
          onCollapse={toggleRightSide}
        />
      </Layout>
      <SkinToolbox onChangeTheme={onChangeTheme} theme={theme} />
    </Layout>
  );
};

export default Basic;
