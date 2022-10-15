import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import cssAnimate, { isCssAnimationSupported } from 'css-animation';
import cx from 'classnames';
import omit from 'object.omit';

function CSSAnimate(props) {
  const {
    className,
    children,
    delay,
    duration,
    style,
    component = 'div',
    ...otherProps
  } = props;

  const node = useRef();

  function animate(type, callback) {
    // const node = ReactDOM.findDOMNode(CSSAnimate);
    if (isCssAnimationSupported && type) {
      cssAnimate(node.current, type, callback);
    } else if (!isCssAnimationSupported) {
      console.warn('不支持css动画');
    }
  }

  useEffect(() => {
    setTimeout(() => {
      animate(props.type, props.callback);
    }, 200);
  });

  const Component = component;
  const classnames = cx('animated', className);
  const _style = { ...style };
  if (duration) {
    _style.animationDuration = duration + 'ms';
    _style.WebkitAnimationDuration = duration + 'ms';
  }

  if (delay) {
    _style.animationDelay = delay + 'ms';
    _style.WebkitAnimationDelay = delay + 'ms';
  }

  const divProps = omit(otherProps, ['type', 'callback', 'delay', 'duration']);

  return (
    <Component className={classnames} {...divProps} style={_style} ref={node}>
      {children}
    </Component>
  );
}

// CSSAnimate.propTypes = {
//   type: PropTypes.string, // 动画名称
//   callback: PropTypes.func, // 动画结束的回调函数
//   duration: PropTypes.number, // 动画持续时间
//   delay: PropTypes.number, // 动画延时
//   component: PropTypes.string // 容器
// };

export default CSSAnimate;
