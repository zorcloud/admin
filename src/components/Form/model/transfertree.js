import React, { useEffect, useState } from 'react';
import { Modal, Select } from 'antd';
import TransferTree from '../../TransferTree';
import { isFunction } from '@/utils';
const Option = Select.Option;

/**
 *  formItem: {
      type: 'transfer',
      modal: true,
      dataSource: employees,
      normalize: (value) => value.map(item => item.key)
    }
 */
const TransferTreeControlled = props => {
  const { modal, placeholder, ...otherProps } = props;

  const [value, setValue] = useState(props.value);
  const [dataSource, setDataSource] = useState(props.dataSource);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const triggerChange = (targetKeys, targetNodes) => {
    const { modal, onChange } = props;
    setValue(targetNodes);
    if (onChange && !modal) {
      onChange(targetNodes);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const onSelectChange = (value, option) => {
    const { onChange } = props;
    setValue(value);
    onChange && onChange(value);
  };

  const comp = (
    <TransferTree
      {...otherProps}
      dataSource={dataSource}
      targetNodes={value}
      onChange={triggerChange}
    />
  );

  if (modal || otherProps.disabled) {
    return (
      <div>
        <div onClick={otherProps.disabled ? () => {} : showModal}>
          <Select
            readOnly
            disabled={!!otherProps.disabled}
            mode="multiple"
            open={false}
            value={otherProps.value}
            onChange={onSelectChange}
            placeholder={placeholder}
          >
            {otherProps.value &&
              dataSource
                .filter(item => otherProps.value.indexOf(item.key) !== -1)
                .map(item => (
                  <Option key={item.key} value={item.key}>
                    {item.title || item.label}
                  </Option>
                ))}
          </Select>
        </div>
        <Modal
          className="antui-transfer-modal"
          title={'请选择' + otherProps.title}
          visible={visible}
          width={modal.width || 480}
          onOk={hideModal}
          onCancel={hideModal}
          okText="确定"
          cancelText="取消"
          {...modal}
        >
          {comp}
        </Modal>
      </div>
    );
  }

  return comp;
};

// static propTypes = {
//   value: PropTypes.array,
//   dataSource: PropTypes.array,
//   onChange: PropTypes.func
// };

/**
 * TransferTreeForm组件
 */
const func = ({
  form,
  name,
  formFieldOptions = {},
  record,
  initialValue,
  rules,
  onChange,
  dataSource,
  normalize,
  placeholder,
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

  // 如果有rules
  if (rules && rules.length) {
    formFieldOptions.rules = rules;
  }

  // 如果需要onChange
  if (typeof onChange === 'function') {
    formFieldOptions.onChange = value => onChange(form, value); // form, value
  }

  const props = {
    placeholder: placeholder || `请选择${otherProps.title}`,
    ...otherProps
  };

  // return getFieldDecorator(
  //   name,
  //   formFieldOptions
  // )(<TransferTreeControlled dataSource={dataSource} {...props} />);
  return [
    name,
    formFieldOptions,
    <TransferTreeControlled dataSource={dataSource} {...props} />
  ];
};
export default func;
