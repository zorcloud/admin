import './style/index.less';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import cssAnimate, { isCssAnimationSupported } from 'css-animation';
import cx from 'classnames';
import Icon from '../Icon';
import { isFunction } from '../../utils';

const noop = () => {};

const Mask = props => {
  const {
    visible,
    getContainer,
    onClose,
    children,
    className,
    prefixCls = 'basic-mask',
    closable,
    maskClosable = true
  } = props;

  const containerRef = useRef();
  // const container = document.createElement('div');
  // debugger; 2022-10-6 16:37:07
  const node = useRef();

  const pRef = useRef();

  useEffect(() => {
    // console.log('------------start');

    if (!containerRef.current) {
      // containerRef 赋值后， 由于ReactDOM.createPortal， 所以containerRef里面就有了该组件元素
      containerRef.current = document.createElement('div');
    }
    if (!pRef.current) {
      if (isFunction(getContainer)) {
        if (!node.current) return;
        pRef.current = getContainer(node.current);
      }
    }
    // const mountNode = getContainer(ReactDOM.findDOMNode(Mask));
    // console.log('1', getContainer(node.current));
    // console.log('2', containerRef.current);
    // let newContainer = {};
    // debugger;
    if (isFunction(getContainer)) {
      pRef.current && pRef.current.appendChild(containerRef.current);
    } else {
      document.body.appendChild(containerRef.current);
    }
    toggle(visible);
    return () => {
      // console.log(newContainer === containerRef.current);
      // console.log('------------end');
      containerRef.current.parentNode &&
        containerRef.current.parentNode.removeChild(containerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // useEffect(() => {
  //   toggle(visible);
  // }, [])

  function toggle(visible) {
    if (!node.current) return;
    if (visible) node.current.style.display = 'block';

    if (isCssAnimationSupported) {
      cssAnimate(node.current, `fade${visible ? 'In' : 'Out'}`, _ => {
        node.current.style.display = visible ? 'block' : 'none';
      });
    } else {
      node.current.style.display = visible ? 'block' : 'none';
    }
  }

  const onClick = e => {
    if (
      (e.target.classList.contains(prefixCls) ||
        e.target.classList.contains(prefixCls + '-close')) &&
      onClose
    ) {
      onClose(e);
    }
  };

  if (containerRef.current) {
    return ReactDOM.createPortal(
      <div
        ref={node}
        className={cx(prefixCls, 'animated', 'animated-short', className)}
        onClick={maskClosable ? onClick : noop}
      >
        {closable ? (
          <Icon
            className={`${prefixCls}-close`}
            type="close"
            onClick={onClick}
          />
        ) : null}
        {children}
      </div>,
      containerRef.current
    );
  }

  return <div ref={node}></div>;
};

export default Mask;
