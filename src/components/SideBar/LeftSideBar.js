/**
 * 来源
 * https://github.com/ant-design/ant-design-pro/blob/master/src/components/SiderMenu/SiderMenu.js
 */
import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Menu, Layout, Switch, Select, Drawer } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Icon from '../Icon';

import logoImg from '@/assets/images/logo.png';
import './style/index.less';
import { Link, useLocation } from 'react-router-dom';
const Option = Select.Option;
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={`sider-menu-item-img`} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} antd />;
  }
  return icon;
};

export const getMeunMatchKeys = (flatMenu, path) => {
  return flatMenu.filter(item => {
    return pathToRegexp(item.path).test(path);
  });
};

const LeftSideBar = props => {
  const [openKeys, setOpenKeys] = useState(
    props.currentMenu ? props.currentMenu.parentPath : []
  );
  useEffect(() => {
    setOpenKeys(props.currentMenu.parentPath || []);
  }, [props.currentMenu.parentPath]);

  // conversion Path
  // 转化路径
  const conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/').replace(/\/:\w+\??/, '');
    }
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  const getMenuItemPath = item => {
    const itemPath = conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { isMobile, onCollapse } = props;
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === props.location.pathname}
        onClick={isMobile ? onCollapse : () => {}}
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  /**
   * get SubMenu or Item
   */
  const getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = getNavMenuItems(item.children);
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                item.name
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return <Menu.Item key={item.path}>{getMenuItemPath(item)}</Menu.Item>;
    }
  };
  /**
   * 获得菜单子节点
   */
  const getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        const ItemDom = getSubMenuOrItem(item);
        return ItemDom;
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  const getSelectedMenuKeys = () => {
    const selectMenu = getMeunMatchKeys(
      props.flatMenu,
      props.location.pathname
    )[0];
    return selectMenu ? [selectMenu.path] : [];
  };

  const isMainMenu = key => {
    return props.menu.some(
      item => key && (item.key === key || item.path === key)
    );
  };

  const handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne =
      openKeys.filter(openKey => isMainMenu(openKey)).length > 1;
    setOpenKeys(moreThanOne ? [lastOpenKey] : [...openKeys]);
  };

  const {
    fixed = true,
    theme = '',
    collapsed,
    onCollapse,
    onCollapseAll,
    leftCollapsedWidth,
    showHeader,
    menu,
    user,
    isMobile
  } = props;

  const classnames = cx('sidebar-left', 'sidebar-default', {
    affix: !!fixed,
    'sidebar-left-sm': collapsed,
    'show-header': collapsed ? false : showHeader,
    'sidebar-left-close': leftCollapsedWidth === 0,
    [theme]: !!theme
  });

  // if pathname can't match, use the nearest parent's key
  let selectedKeys = getSelectedMenuKeys();
  // Don't show popup menu when it is been collapsed
  const menuProps = collapsed
    ? {
        selectedKeys
      }
    : {
        openKeys,
        selectedKeys
      };

  const siderBar = (
    <Sider
      className={classnames}
      width={230}
      collapsedWidth={leftCollapsedWidth + 0.1}
      collapsible
      collapsed={isMobile ? false : collapsed}
      onCollapse={isMobile ? null : onCollapse}
      breakpoint="lg"
      trigger={null}
    >
      <div className="sidebar-left-content">
        <header className="sidebar-header">
          <div className="userlogged clearfix">
            <Icon type="woman" />
            <div className="user-details">
              <span>{user.name}</span>
              <div className="dropdown">
                <Select
                  size="small"
                  defaultValue="online"
                  popupClassName="sidebar-header-dropdown"
                >
                  <Option value="online">
                    <span className="user online" />
                    在线
                  </Option>
                  <Option value="busy">
                    <span className="user busy" />
                    忙碌
                  </Option>
                  <Option value="invisible">
                    <span className="user invisible" />
                    隐身
                  </Option>
                  <Option value="offline">
                    <span className="user offline" />
                    离线
                  </Option>
                </Select>
              </div>
            </div>
          </div>
        </header>
        <Menu
          onClick={() => {}}
          onOpenChange={handleOpenChange}
          mode="inline"
          theme={theme}
          {...menuProps}
          // items={}
        >
          {getNavMenuItems(menu)}
        </Menu>
        <div className="sidebar-toggle-mini">
          {collapsed && leftCollapsedWidth !== 0 && !isMobile ? (
            <Switch checked={collapsed} onChange={onCollapseAll} size="small" />
          ) : null}
        </div>
      </div>
    </Sider>
  );

  return isMobile ? (
    <Drawer
      className="left-sidebar-drawer"
      visible={!collapsed}
      placement="left"
      onClose={onCollapse}
      width={230}
      closable={false}
    >
      <div className="navbar-branding">
        <div className="navbar-brand">
          <img src={logoImg} alt="logo" />
          <b>LANIF</b>
          Admin
        </div>
        <span className="toggle_sidemenu_l" onClick={onCollapse}>
          <Icon type="lines" />
        </span>
      </div>
      {siderBar}
    </Drawer>
  ) : (
    siderBar
  );
};

export default LeftSideBar;
