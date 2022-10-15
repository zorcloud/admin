import React, { useState } from 'react';
import Icon from '../Icon';
import { Button } from 'antd';
import cx from 'classnames';
import './style/index.less';

const Toolbar = props => {
  const {
    prefixCls = 'antui-toolbar-box',
    className,
    appendLeft,
    pullDownExclude = true,
    childrenClassName = 'toolbar-right',
    children,
    pullDown
  } = props;
  const [openPullDown, setOpenPullDown] = useState(false);

  const togglePullDown = e => {
    e.stopPropagation();
    e.preventDefault();
    setOpenPullDown(!openPullDown);
  };

  return (
    <div className={cx(prefixCls, className)}>
      <div className="content-box">
        <div className="top-panel">
          <div className="left-btn-div">{appendLeft}</div>
          <div
            className={cx(childrenClassName, {
              'toolbar-right-out': pullDownExclude && openPullDown
            })}
          >
            {children}
          </div>
          <div className="pulldown-handle-small">
            {pullDown ? (
              <Button onClick={e => togglePullDown(e)}>
                <Icon
                  type={openPullDown ? 'CaretUpOutlined' : 'CaretDownOutlined'}
                  antd
                />
                {openPullDown ? '收起' : '展开'}
              </Button>
            ) : null}
          </div>
        </div>
        {pullDown ? (
          <div
            className={cx('pulldown-panel', {
              open: openPullDown
            })}
          >
            <span
              className="pulldown-handle"
              title={openPullDown ? '收起' : '展开'}
              onClick={e => togglePullDown(e)}
            >
              <Icon
                type={openPullDown ? 'CaretUpOutlined' : 'CaretDownOutlined'}
                antd
              />
              {openPullDown ? '收起' : '展开'}
            </span>
            <div className="pulldown-body">{pullDown}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
// static propTypes = {
//   appendLeft: PropTypes.node,
//   appendRight: PropTypes.node,
//   disabledDel: PropTypes.bool,
//   children: PropTypes.node,
//   childrenClassName: PropTypes.string,
//   pullDown: PropTypes.any,
//   pullDownExclude: PropTypes.bool
// };
// static defaultProps = {
//   disabledAdd: false,
//   disabledDel: false,
//   pullDownExclude: true,
//   childrenClassName: 'toolbar-right',
//   prefixCls: 'antui-toolbar-box'
// };
export default Toolbar;
