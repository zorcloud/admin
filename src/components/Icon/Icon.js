import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AntdIcon, { BorderOutlined } from '@ant-design/icons';

/**
 * 字体图标，兼容antd的图标
 */
function Icon(props) {
  const {
    prefixCls = 'antui-icon',
    type,
    className = '',
    children,
    font = 'ad',
    antd,
    spin,
    ...restProps
  } = props;
  const cn = classnames(
    prefixCls,
    {
      [font]: font,
      [font + '-' + type]: font && type,
      spin
    },
    className
  );
  if (/^&#x.+;$/.test(type)) {
    return (
      <i
        className={cn}
        {...restProps}
        dangerouslySetInnerHTML={{ __html: type }}
      />
    );
  }
  if (antd) {
    const antdcn = classnames(prefixCls, className);
    if (typeof type === 'string') {
      const Icons = require('@ant-design/icons')[type] || BorderOutlined;
      return <Icons className={antdcn} spin={spin} {...restProps} />;
    } else if (React.isValidElement(type)) {
      return (
        <AntdIcon
          component={() => type}
          className={antdcn}
          spin={spin}
          {...restProps}
        />
      );
    }
  }
  return (
    <i className={cn} {...restProps}>
      {children}
    </i>
  );
}

// Icon.propTypes = {
//   prefixCls: PropTypes.string,
//   type: PropTypes.any.isRequired,
//   className: PropTypes.string,
//   children: PropTypes.node,
//   font: PropTypes.string,
//   antd: PropTypes.bool,
//   spin: PropTypes.bool
// };

export default Icon;
