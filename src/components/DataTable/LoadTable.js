import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import DataTable from './DataTable';
import { isObject } from '@/utils';
import PageHelper from '@/utils/pageHelper';

const Pagination = DataTable.Pagination;

/**
 * loadData 风格异步加载的表格
 */
const LoadTable = props => {
  const {
    columns,
    rowKey = 'id',
    selectType,
    showNum,
    pagination,
    paginationContainer,
    loadData,
    onChange,
    ...otherProps
  } = props;

  const [value, setValue] = useState([]);
  const [rows, setRows] = useState([]);
  const [dataSource, setDataSource] = useState(PageHelper.create());
  useEffect(() => {
    if (loadData) {
      onChange({ pageNum: 1 });
    }
  });

  const onSelect = (keys, rows) => {
    setValue(keys);
    setRows(rows);
    if (onChange) {
      onChange(keys, rows);
    }
  };

  const change = async ({ pageNum, pageSize }) => {
    if (loadData) {
      const newDataSource = await loadData(
        dataSource.jumpPage(pageNum, pageSize)
      );
      setDataSource(Object.assign(dataSource, newDataSource));
    }
  };

  const onSelectChange = (value, option) => {
    const newRows = rows.filter(item => value.indexOf(item[rowKey]) !== -1);
    setValue(value);
    setRows(newRows);
    onChange && onChange(value, newRows);
  };

  const dataTableProps = {
    columns,
    rowKey,
    dataItems: dataSource,
    selectedRowKeys: value,
    selectType: typeof selectType === 'undefined' ? 'checkbox' : selectType,
    showNum: typeof showNum === 'undefined' ? true : showNum,
    isScroll: true,
    onChange: ({ pageNum, pageSize }) => change({ pageNum, pageSize }),
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

  if (paginationContainer) {
    ReactDOM.createPortal(
      pagination === false ? null : (
        <Pagination
          key="paging"
          size="small"
          showSizeChanger={false}
          showQuickJumper={false}
          {...dataTableProps}
        />
      ),
      paginationContainer
    );
  }

  return <DataTable {...dataTableProps} />;
};

// 将值转成对像数组
LoadTable.getRows = (value, oldValue = [], props) => {
  const { rowKey } = props;
  if (value) {
    return value.map(item => {
      const oldv = oldValue.filter(jtem => jtem[rowKey] === item)[0];
      return typeof item === 'object' ? item : oldv || { [rowKey]: item };
    });
  }
  return [];
};

LoadTable.getKeys = (value, props) => {
  const { rowKey } = props;
  if (value) {
    return value.map(item => (isObject(item) ? item[rowKey] : item));
  }
  return [];
};

// static propTypes = {
//   columns: PropTypes.array,
//   value: PropTypes.array,
//   dataSource: PropTypes.object,
//   onChange: PropTypes.func,
//   loadData: PropTypes.func
// };

export default LoadTable;
