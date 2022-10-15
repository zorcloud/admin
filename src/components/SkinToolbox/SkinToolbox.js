import './style/index.less';
import React, { useState } from 'react';
import cx from 'classnames';
import Icon from '../Icon';
import { Tabs } from 'antd';
import SideBarBox from './SideBarBox';
import NavBarBox from './NavBarBox';
import LayoutBox from './LayoutBox';
const TabPane = Tabs.TabPane;

/**
 * 设置皮肤的右侧滑动的面板
 */
const SkinToolbox = props => {
  const [collapsed, setCollapsed] = useState(true);

  const onChangeSideColor = e => {
    props.onChangeTheme({
      ...props.theme,
      leftSide: e.target.value
    });
  };

  const onChangeNavBarColor = e => {
    props.onChangeTheme({
      ...props.theme,
      navbar: e.target.value
    });
  };

  const onChangeLayout = value => {
    props.onChangeTheme({
      ...props.theme,
      layout: value
    });
  };

  const clearThemeStore = _ => {
    localStorage.removeItem('theme');
  };

  /**
   * 切换皮肤设置面板
   */
  const toggleSkinToolbox = _ => {
    setCollapsed(!collapsed);
  };

  const { theme } = props;

  const classnames = cx('skin-toolbox', {
    'skin-toolbox-close': collapsed
  });

  return (
    <div className={classnames}>
      <div className="panel">
        <div className="panel-head" onClick={toggleSkinToolbox}>
          <span className="panel-icon">
            <Icon type="gear" />
          </span>
          <span className="panel-title">设置您的主题</span>
        </div>
        <div className="panel-body">
          <Tabs
            defaultActiveKey="1"
            size="small"
            animated={{ inkBar: true, tabPane: true }}
          >
            <TabPane tab="导航条" key="navbar">
              <h4>导航条样式</h4>
              <NavBarBox theme={theme} onChange={onChangeNavBarColor} />
            </TabPane>
            <TabPane tab="边栏" key="sidebar">
              <h4>边栏样式</h4>
              <SideBarBox theme={theme} onChange={onChangeSideColor} />
            </TabPane>
            <TabPane tab="布局" key="misc">
              <h4>布局样式</h4>
              <LayoutBox theme={theme} onChange={onChangeLayout} />
            </TabPane>
          </Tabs>
        </div>
        <div className="panel-footer">
          <a className="btn-primary" onClick={clearThemeStore}>
            清理存储
          </a>
        </div>
      </div>
    </div>
  );
};

export default SkinToolbox;
