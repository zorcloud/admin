import React, { useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import { isFunction, debounce } from '@/utils';
import omit from 'object.omit';
const Option = AutoComplete.Option;

const AutoCompleteControlled = props => {
  const {
    onChange,
    loadData,
    valueField,
    optionLabelProp,
    render,
    keyField,
    renderItem
  } = props;
  const [value, setValue] = useState(props.value);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = loadData ? debounce(_handleSearch, 500) : null;

  useEffect(() => {
    setValue(props.value);
    if (!loadData && props.dataSource) {
      setDataSource(props.value ? props.dataSource : []);
    }
  }, [props.dataSource, props.value, loadData]);

  const onSearch = value => {
    if (onChange) {
      onChange(value, {});
    }
    if (!value.trim()) {
      setDataSource([]);
      setValue(value);
      return;
    } else {
      setValue(value);
    }

    if (loadData) {
      handleSearch(value);
    }
  };

  function _handleSearch(value) {
    const { loadData } = props;

    // 设置 { loading: true }; // input suffix 属性当输入时会引起输入中断
    const promise = loadData(value);
    if (promise && promise.then) {
      promise
        .then(listItem => {
          setDataSource(listItem);
          setLoading(false);
        })
        .catch(e => setDataSource([]) && setLoading(false));
    }
  }

  const renderOptions = dataSource => {
    if (render) return render(dataSource) || [];
    else if (renderItem) {
      return dataSource.map(renderOptionItem);
    } else {
      return dataSource;
    }
  };

  const renderOptionItem = (item, index) => {
    return (
      <Option key={item[keyField] || index} {...item}>
        {renderItem(item)}
      </Option>
    );
  };

  const onSelect = (value, option) => {
    if (onChange) {
      const itemProps = option.props;
      const valueKey = valueField || optionLabelProp;
      const rvalue = itemProps[valueKey] || value;
      onChange(rvalue, option);
    }
  };

  const autoComponentProps = omit(props, ['value', 'dataSource', 'onChange']);
  return (
    <AutoComplete
      value={value}
      defaultActiveFirstOption={false}
      dataSource={renderOptions(dataSource)}
      onSelect={onSelect}
      onChange={onSearch}
      optionLabelProp={valueField}
      {...autoComponentProps}
      allowClear={false}
    >
      <Input
        suffix={
          loading ? <LoadingOutlined className="auto-complete-loading" /> : null
        }
      />
    </AutoComplete>
  );
};

// static propTypes = {
//   value: PropTypes.any,
//   dataSource: PropTypes.array,
//   onChange: PropTypes.func,
//   keyField: PropTypes.string,
//   valueField: PropTypes.string,
//   render: PropTypes.func,
//   renderItem: PropTypes.func
// };

const autoComplete = ({
  form,
  name,
  formFieldOptions = {}, // 验证写到columns.jsx
  record,
  initialValue,
  rules,
  onChange,
  dataSource,
  normalize,
  getPopupContainer,
  placeholder,
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
    formFieldOptions.onChange = (value, option) =>
      onChange(form, value, option); // form, value, option 选中的项
  }

  const props = {
    placeholder: placeholder || `请输入${otherProps.title}`,
    ...otherProps
  };

  if (getPopupContainer) {
    props.getPopupContainer = getPopupContainer;
  }

  // return getFieldDecorator(
  //   name,
  //   formFieldOptions
  // )(<AutoCompleteControlled dataSource={dataSource} {...props} />);
  return [
    name,
    formFieldOptions,
    <AutoCompleteControlled dataSource={dataSource} {...props} />
  ];
};

export default autoComplete;
