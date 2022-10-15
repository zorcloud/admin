import React, { useState } from 'react';
import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { debounce } from '@/utils';

const Search = props => {
  const { placeholder = '', prefixCls } = props;
  const [value, setValue] = useState('');

  const onChange = debounce(props.onChange, 500);

  const handleChange = value => {
    props.onChange && onChange(value);
    setValue(value);
  };

  const handleClear = e => {
    e.preventDefault();
    props.handleClear && props.handleClear(e);
    setValue('');
  };

  const icon =
    value && value.length > 0 ? (
      <a className={`${prefixCls}-action`} onClick={handleClear}>
        <CloseCircleFilled />
      </a>
    ) : (
      <span className={`${prefixCls}-action`}>
        <SearchOutlined />
      </span>
    );
  return (
    <div>
      <Input
        placeholder={placeholder}
        className={prefixCls}
        value={value}
        ref="input"
        onChange={e => handleChange(e.target.value)}
      />
      {icon}
    </div>
  );
};
export default Search;
