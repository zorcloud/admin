import React, { Component, useState } from 'react';

import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Input, Col } from 'antd';
/**
 * 密码控件
 */
const PasswordForm = props => {
  const {
    form,
    name,
    formFieldOptions = {},
    rules,
    placeholder,
    type,
    formItemLayout,
    col,
    repeat,
    getPopupContainer,
    ...otherProps
  } = props;

  // const { getFieldDecorator } = form;

  const [confirmDirty, setConfirmDirty] = useState(false);

  const handleConfirmBlur = e => {
    const value = e.target.value;
    setConfirmDirty(confirmDirty || !!value);
  };

  const checkPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue(props.name)) {
      callback('两次输入密码不一致!');
    } else {
      callback();
    }
  };

  const checkConfirm = (rule, value, callback) => {
    if (value && confirmDirty) {
      form.validateFields([name + '_repeat'], { force: true });
    }
    callback();
  };

  // 如果有rules
  formFieldOptions.rules = [
    {
      required: true,
      message: `请输入${otherProps.title}`
    },
    {
      validator: checkConfirm
    }
  ];

  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = formFieldOptions.rules.concat(rules);
  }

  let ComponentCol = type === 'inline' ? 'div' : Col;

  return (
    <>
      <ComponentCol className="col-item col-item-password" {...col}>
        <Form.Item
          {...formItemLayout}
          label={otherProps.title}
          hasFeedback
          className="col-item-content"
          name
          {...formFieldOptions}
        >
          {
            <Input
              type="password"
              placeholder={placeholder || `请输入${otherProps.title}`}
            />
          }
        </Form.Item>
      </ComponentCol>
      {repeat ? (
        <ComponentCol className="col-item col-item-repeat-password" {...col}>
          <Form.Item
            {...formItemLayout}
            label={'确认' + otherProps.title}
            hasFeedback
            className="col-item-content"
            name={name + '_repeat'}
            rule={[
              {
                required: true,
                message: `请再次输入${otherProps.title}`
              },
              {
                validator: checkPassword
              }
            ]}
          >
            <Input
              type="password"
              onBlur={handleConfirmBlur}
              placeholder="两次输入需保持一致"
            />
          </Form.Item>
        </ComponentCol>
      ) : null}
    </>
  );
};
// static propTypes = {
//   form: PropTypes.object,
//   name: PropTypes.string,
//   formFieldOptions: PropTypes.object,
//   rules: PropTypes.array,
//   placeholder: PropTypes.string,
//   ComponentCol: PropTypes.node,
//   ComponentItem: PropTypes.node,
//   formItemLayout: PropTypes.object,
//   col: PropTypes.object,
//   repeat: PropTypes.bool,
//   type: PropTypes.string
// };
export default PasswordForm;
