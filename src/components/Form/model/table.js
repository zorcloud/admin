import React, { useEffect, useState } from 'react';
import { Modal, Button, Select } from 'antd';
import DataTable from '../../DataTable';
import { isFunction, isObject } from '@/utils';
import PageHelper from '@/utils/pageHelper';

const Pagination = DataTable.Pagination;
const Option = Select.Option;

/**
 *  formItem: {
      type: 'table',
      rowKey: 'id',
      dataSource,
      columns: innerColumns,
      onChange: (form, value) => console.log('。。。:', value),
      loadData: self.onLoadTableData,
      initialValue: [11, 3, 5],
    }
 */
const TableControlled = props => {
  const {
    modal = {},
    columns,
    titleKey,
    rowKey = 'id',
    selectType,
    showNum,
    placeholder,
    getPopupContainer,
    disabled,
    pagination,
    ...otherProps
  } = props;

  const [value, setValue] = useState(getKeys(props.value));
  const [rows, setRows] = useState(getRows(props.value));
  const [dataSource, setDataSource] = useState(
    props.dataSource || PageHelper.create()
  );
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.loadData) {
      onChange({ pageNum: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const _value = getKeys(props.value);
    setValue(_value);
    setRows(getRows(_value, rows));
    if (!props.loadData && props.dataSource) {
      setDataSource(props.dataSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dataSource, props.value, props.loadData]);

  // 将值转成对像数组
  function getRows(value, oldValue = []) {
    if (value) {
      return value.map(item => {
        const oldv = oldValue.filter(jtem => jtem[rowKey] === item)[0];
        return typeof item === 'object' ? item : oldv || { [rowKey]: item };
      });
    }
    return [];
  }

  function getKeys(value) {
    if (value) {
      return value.map(item => (isObject(item) ? item[rowKey] : item));
    }
    return [];
  }

  const onSelect = (keys, rows) => {
    setValue(keys);
    setRows(rows);

    if (props.onChange && !modal) {
      props.onChange(keys, rows);
    }
  };

  async function onChange({ pageNum, pageSize }) {
    if (props.loadData) {
      setLoading(true);

      const newDataSource = await props.loadData(
        dataSource.jumpPage(pageNum, pageSize)
      );
      setLoading(false);
      setDataSource(Object.assign(dataSource, newDataSource));
    }
  }

  const onSelectChange = (value, option) => {
    const { onChange } = props;
    const newRows = rows.filter(item => value.indexOf(item[rowKey]) !== -1);
    setValue(value);
    setRows(newRows);
    onChange && onChange(value, newRows);
  };

  const showModal = () => {
    setVisible(true);
  };

  const onSubmit = () => {
    const { onChange } = props;
    hideModal();
    onChange && onChange(value, rows);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const dataTableProps = {
    loading,
    columns,
    rowKey,
    dataItems: dataSource,
    selectedRowKeys: value,
    selectType: typeof selectType === 'undefined' ? 'checkbox' : selectType,
    showNum: typeof showNum === 'undefined' ? true : showNum,
    isScroll: true,
    onChange: ({ pageNum, pageSize }) => onChange({ pageNum, pageSize }),
    onSelect: (keys, rows) => onSelect(keys, rows),
    pagination:
      pagination === false
        ? false
        : {
            showSizeChanger: false,
            showQuickJumper: false,
            ...pagination
          }
  };
  if (modal || disabled) {
    return (
      <div>
        <div onClick={disabled ? () => {} : showModal}>
          <Select
            readOnly
            disabled={!!disabled}
            mode="multiple"
            open={false}
            value={titleKey ? value : value.length ? '_selected' : []}
            onChange={onSelectChange}
            placeholder={placeholder}
          >
            {titleKey ? (
              rows.map(item => (
                <Option key={item[rowKey]} value={item[rowKey]}>
                  {item[titleKey]}
                </Option>
              ))
            ) : (
              <Option key="_selected" value="_selected">
                已选择{rows.length}项
              </Option>
            )}
          </Select>
        </div>
        <Modal
          className="antui-table-modal"
          title={'请选择' + otherProps.title}
          visible={visible}
          width={modal.width || 600}
          onCancel={hideModal}
          footer={
            <>
              <div className="left">
                {pagination === false ? null : (
                  <Pagination
                    key="paging"
                    size="small"
                    showSizeChanger={false}
                    showQuickJumper={false}
                    {...dataTableProps}
                  />
                )}
              </div>
              <Button key="back" onClick={hideModal}>
                取消
              </Button>
              <Button key="submit" type="primary" onClick={onSubmit}>
                确定
              </Button>
            </>
          }
          {...modal}
        >
          <DataTable {...dataTableProps} pagination={false} />
        </Modal>
      </div>
    );
  }

  return <DataTable {...dataTableProps} />;
};
// static propTypes = {
//   value: PropTypes.array,
//   dataSource: PropTypes.object,
//   onChange: PropTypes.func,
//   loadData: PropTypes.func
// };

/**
 * TableForm组件
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
  rowKey,
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
    formFieldOptions.onChange = (value, rows) => onChange(form, value, rows); // form, value
  }

  const props = {
    placeholder: placeholder || `请选择${otherProps.title}`,
    ...otherProps
  };

  // return getFieldDecorator(
  //   name,
  //   formFieldOptions
  // )(
  //   <TableControlled
  //     dataSource={dataSource}
  //     rowKey={rowKey || name}
  //     {...props}
  //   />
  // );
  return [
    name,
    formFieldOptions,
    <TableControlled
      dataSource={dataSource}
      rowKey={rowKey || name}
      {...props}
    />
  ];
};

export default func;
