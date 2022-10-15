import React, { useRef } from 'react';
import cx from 'classnames';
import './style/ripple.less';

/**
 * 仿 material design ripple 效果
 */
const Ripple = props => {
  const element = useRef();

  const createRipple = e => {
    const btnWidth = element.current.clientWidth;
    const rect = element.current.getBoundingClientRect();
    const btnOffsetTop = rect.top;
    const btnOffsetLeft = rect.left;
    const posMouseX = e.pageX;
    const posMouseY = e.pageY;
    const rippleX = posMouseX - btnOffsetLeft;
    const rippleY = posMouseY - btnOffsetTop;

    const rippleAnimate = document.createElement('div');
    rippleAnimate.className = 'ripple-animate';
    const baseStyle = `
      top: ${rippleY - btnWidth}px;
      left: ${rippleX - btnWidth}px;
      width: ${btnWidth * 2}px;
      height: ${btnWidth * 2}px;
    `;
    rippleAnimate.style.cssText = baseStyle;
    element.current.appendChild(rippleAnimate);

    setTimeout(() => {
      requestAnimationFrame(() => {
        rippleAnimate.style.cssText =
          baseStyle +
          ' transform: scale(1); -webkit-transition: scale(1); opacity: 0;';
      });
    }, 50); // 如不加延时有时动画不会生效，没找到原因

    setTimeout(() => {
      rippleAnimate.remove();
    }, 750);
  };

  const { children, type, ghost, ...otherProps } = props;
  return (
    <a
      ref={element}
      className={cx('ripple-btn', type, { ghost })}
      {...otherProps}
      onClick={e => createRipple(e)}
    >
      <span>{children}</span>
    </a>
  );
};

export default Ripple;
