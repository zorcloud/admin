import React, { useState, useEffect, useRef } from 'react';
import E from 'wangeditor';
import defaultConfig from './config';
import { debounce, isFunction } from '@/utils';
import './style/index.less';

const Editor = props => {
  const [value, setValue] = useState(props.value);
  const editorDomRef = useRef();
  const editorRef = useRef();
  // 设置这个值控制同步速度，速度过快影响输入体验，过慢可能获取到的是老值
  // 如果体验过差，建议不要回传value, 使用onLoaded获取wangeditor实例
  const _onChange = debounce(onChange, 2000);

  useEffect(() => {
    const { value, onLoaded, ...otherProps } = props;
    editorRef.current = new E(editorDomRef.current);
    editorRef.current.customConfig = {
      ...defaultConfig,
      onchange: _onChange,
      ...otherProps
    };

    if (onLoaded && isFunction(otherProps.onChange)) {
      editorRef.current.customConfig.onchange = otherProps.onChange;
    }

    editorRef.current.create();
    editorRef.current.txt.html(value);

    // 返回wangeditor
    if (onLoaded) onLoaded(editorRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(props.value);
    editorRef.current.txt.html(props.value || '');
    _onChange(props.value);
  }, [_onChange, props.value]);

  function onChange(html) {
    const { onChange } = props;
    if (onChange) onChange(html);
  }

  return <div className="antui-editor" ref={editorDomRef} />;
};
// static propTypes = {
//   value: PropTypes.string,
//   onLoaded: PropTypes.func,
// }

export default Editor;
