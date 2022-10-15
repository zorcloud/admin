import React, { useEffect, useState } from 'react';
import Icon from '../Icon';
import cx from 'classnames';
import CSSAnimate from '../CSSAnimate';
import { Popconfirm, Modal } from 'antd';
import isEqual from 'react-fast-compare';
import './style/index.less';
import { isFunction } from '../../utils';
const confirm = Modal.confirm;
const noop = _ => {};
/**
 * 面板组件
 */
const Panel = props => {
  const {
    theme,
    prefix = 'antui-panel',
    className,
    title,
    width,
    height,
    style,
    children,
    header,
    cover,
    onChange,
    onRefresh,
    onClose,
    scroll
  } = props;
  const [collapse, setCollapse] = useState(props.collapse || false);
  const [expand, setExpand] = useState(props.expand || false);
  const [refresh, setRefresh] = useState(0);
  const [animationName, setAnimationName] = useState('');

  const onExpand = expand => e => {
    setExpand(expand);
    setCollapse(false);

    if (onChange) {
      onChange({
        expand,
        collapse: false
      });
    }
  };

  const onCollapse = collapse => e => {
    const { onChange } = props;

    setExpand(false);
    setCollapse(collapse);

    if (onChange) {
      onChange({
        collapse,
        expand: false
      });
    }
  };

  const handleRefresh = () => {
    setRefresh(refresh + 1);
    setAnimationName('fadeIn');

    isFunction(onRefresh) && onRefresh();
  };

  const handleClose = () => {
    if (expand) {
      confirm({
        title: '提示',
        content: '您确认要关闭这个面板？',
        onOk: () => {
          isFunction(onClose) && onClose();
        }
      });
    } else {
      isFunction(onClose) && onClose();
    }
  };

  const classnames = cx(prefix, className, {
    theme: !!theme,
    'panel-fullscreen': !!expand,
    'panel-collapsed': !!collapse,
    cover: !!cover
  });

  const styles = {
    ...style,
    width
  };
  const bodyStyles = {};
  if (!expand) {
    bodyStyles.height = height;
  }
  if (scroll) {
    bodyStyles.overflow = 'auto';
  }

  const Header =
    typeof header === 'undefined' ? (
      <div className={`${prefix}-header`}>
        <span className={`${prefix}-header-title`}>{title}</span>
        <span className={`${prefix}-header-controls`}>
          <a className="panel-control-loader" onClick={handleRefresh}>
            <Icon type="refresh" />
          </a>
          <a
            className="panel-control-fullscreen"
            onClick={onExpand(expand ? false : true)}
          >
            <Icon type={`${expand ? 'shrink' : 'enlarge'}`} />
          </a>
          <a
            className="panel-control-collapsed"
            onClick={onCollapse(collapse ? false : true)}
          >
            <Icon type={`${collapse ? 'plus' : 'minus'}`} />
          </a>
          <Popconfirm
            title="您确认要关闭这个面板？"
            onConfirm={handleClose}
            placement="topRight"
          >
            <a
              className="panel-control-remove"
              onClick={expand ? handleClose : noop}
            >
              <Icon type="close" />
            </a>
          </Popconfirm>
        </span>
      </div>
    ) : (
      header
    );

  return (
    <div className={classnames} style={styles}>
      {Header}
      <div className={`${prefix}-body`} style={bodyStyles}>
        <CSSAnimate
          className="panel-content"
          type={animationName}
          callback={_ => setAnimationName('')}
          key={refresh}
        >
          {children}
        </CSSAnimate>
      </div>
    </div>
  );
};

export default Panel;
