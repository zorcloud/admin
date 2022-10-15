import React, { useEffect, useState } from 'react';
import { Breadcrumb, Row, Col } from 'antd';
import Icon from '../Icon';
import cx from 'classnames';
import CSSAnimate from '../CSSAnimate';
import Mask from '../Mask';
import './style/index.less';
import { Link } from 'react-router-dom';

const TopBar = props => {
  const [currentRoute, setCurrentRoute] = useState([]);

  useEffect(() => {
    setCurrentRoute(getRouteLevel(props.location.pathname) || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);

  const [prevCurrentRoute, setPrevCurrentRoute] = useState(null);

  const { expand, toggleRightSide, collapsedRightSide, onCollapse } = props;

  if (props.currentRoute !== prevCurrentRoute) {
    setPrevCurrentRoute(props.currentRoute);
    setCurrentRoute(getRouteLevel(props.location.pathname));
  }

  function getRouteLevel(pathName) {
    const orderPaths = [];
    pathName.split('/').reduce((prev, next) => {
      const path = [prev, next].join('/');
      orderPaths.push(path);
      return path;
    });

    return orderPaths
      .map(item => window.dva_router_pathMap[item])
      .filter(item => !!item);
  }

  const classnames = cx('topbar', {
    'topbar-expand': expand
  });

  return (
    <div className={classnames}>
      <div className="topbar-dropmenu">
        <Row gutter={22}>
          <Col xs={8} md={4}>
            <CSSAnimate
              className="animated-short"
              type={expand ? 'fadeInDown' : 'fadeOutUp'}
            >
              <a className="metro-tile">
                <Icon type="message" />
                <span className="metro-title">信息</span>
              </a>
            </CSSAnimate>
          </Col>
          <Col xs={8} md={4}>
            <CSSAnimate
              className="animated-short"
              type={expand ? 'fadeInDown' : 'fadeOutUp'}
            >
              <a className="metro-tile">
                <Icon type="user" />
                <span className="metro-title">用户</span>
              </a>
            </CSSAnimate>
          </Col>
          <Col xs={8} md={4}>
            <CSSAnimate
              className="animated-short"
              type={expand ? 'fadeInDown' : 'fadeOutUp'}
            >
              <a className="metro-tile">
                <Icon type="headphones" />
                <span className="metro-title">支持</span>
              </a>
            </CSSAnimate>
          </Col>
          <Col xs={8} md={4}>
            <CSSAnimate
              className="animated-short"
              type={expand ? 'fadeInDown' : 'fadeOutUp'}
            >
              <a className="metro-tile">
                <Icon type="equalizer" />
                <span className="metro-title">设置</span>
              </a>
            </CSSAnimate>
          </Col>
          <Col xs={8} md={4}>
            <CSSAnimate
              className="animated-short"
              type={expand ? 'fadeInDown' : 'fadeOutUp'}
            >
              <a className="metro-tile">
                <Icon type="play" />
                <span className="metro-title">视频</span>
              </a>
            </CSSAnimate>
          </Col>
          <Col xs={8} md={4}>
            <CSSAnimate
              className="animated-short"
              type={expand ? 'fadeInDown' : 'fadeOutUp'}
            >
              <a className="metro-tile">
                <Icon type="image" />
                <span className="metro-title">图片</span>
              </a>
            </CSSAnimate>
          </Col>
        </Row>
      </div>
      <header className="topbar-content">
        {currentRoute.length ? (
          <Breadcrumb>
            <Breadcrumb.Item className="first">
              <CSSAnimate className="inline-block" type="flipInX">
                {currentRoute[currentRoute.length - 1].title}
              </CSSAnimate>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="icon">
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/">主页</Link>
            </Breadcrumb.Item>
            {currentRoute.map((item, index) => (
              <Breadcrumb.Item key={index}>
                {index === currentRoute.length - 1 ? (
                  <CSSAnimate className="inline-block" type="flipInX">
                    {item.title}
                  </CSSAnimate>
                ) : (
                  <Link to={item.path}>{item.title}</Link>
                )}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        ) : null}
        <a
          className={cx('topbar-right', { collapse: collapsedRightSide })}
          onClick={toggleRightSide}
        >
          <Icon type="into" />
        </a>
      </header>
      <Mask
        visible={expand}
        onClose={onCollapse}
        getContainer={node => node.parentNode}
      />
    </div>
  );
};

export default TopBar;
