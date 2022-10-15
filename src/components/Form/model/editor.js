import React, { useEffect, useState } from 'react';
import Editor from '../../Editor';
import { isFunction } from '@/utils';
import omit from 'object.omit';

const EditorControlled = props => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const triggerChange = value => {
    const onChange = props.onChange;
    if (onChange) {
      onChange(value);
    }
  };

  const otherProps = omit(props, 'value');

  return <Editor value={value} onChange={triggerChange} {...otherProps} />;
};
// static propTypes = {
//   value: PropTypes.string,
//   onChange: PropTypes.func
// };

/**
 * EditorForm组件
 */

const EditorForm = ({
  form,
  name,
  formFieldOptions = {},
  record,
  initialValue,
  rules,
  onChange,
  normalize,
  preview,
  getPopupContainer,
  ...otherProps
}) => {
  // const { getFieldDecorator } = form;

  let initval = initialValue;

  if (record) {
    initval = record[name];
  }

  // 如果存在初始值
  if (initval !== null && typeof initval !== 'undefined') {
    if (isFunction(normalize)) {
      formFieldOptions.initialValue = normalize(initval);
    } else {
      formFieldOptions.initialValue = initval;
    }
  }

  if (preview) {
    return (
      <div
        style={otherProps.style}
        dangerouslySetInnerHTML={{ __html: initval || '' }}
      />
    );
  }

  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // 如果需要onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = value => onChange(form, value); // form, value
  }

  // return getFieldDecorator(
  //   name,
  //   formFieldOptions
  // )(<EditorControlled {...otherProps} />);
  return [name, formFieldOptions, <EditorControlled {...otherProps} />];
};

export default EditorForm;
