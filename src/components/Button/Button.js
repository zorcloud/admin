import React from 'react';
import { Button, Tooltip } from 'antd';
import './style/index.less';

const ButtonGroup = Button.Group;
/**
 *  Button
 */
const Index = props => {
  const { tooltip, prefixCls = 'antui-button-tooltip', ...otherProps } = props;
  return tooltip ? (
    <Tooltip
      overlayClassName={prefixCls}
      title={tooltip === true ? otherProps.title : tooltip}
    >
      <Button {...otherProps} />
    </Tooltip>
  ) : (
    <Button {...otherProps} />
  );
};
Index.Group = ButtonGroup;

// Index.propTypes = {
//     /**
//      * 是否用Tooltip组件显示提示信息
//      */
//     tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.node])
//   };

export default Index;
