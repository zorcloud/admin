import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import classNames from 'classnames';

function noop() {}

const List = props => {
  const {
    prefixCls = 'antui-transfer-tree-list',
    notFoundContent,
    style,
    max,
    render,
    titleKey,
    dataSource: propsDataSource = [],
    rowKey = 'key',
    onDeleteItem = noop
  } = props;
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(propsDataSource);
  }, [dataSource, propsDataSource]);

  const handleDeleteItem = (e, items) => {
    e.preventDefault();
    e.stopPropagation();

    onDeleteItem(items ? items : dataSource);
  };

  const renderItem = (i, key) => {
    let item = dataSource[i];

    return (
      <li
        className="list-comp-item"
        data-key={item[rowKey]}
        title={item[titleKey]}
        key={item[rowKey]}
      >
        <span className="list-comp-item-body">
          {render ? render(item) : item.title}
        </span>
        <a
          className={`list-comp-clear-item`}
          onClick={e => handleDeleteItem(e, [item])}
        >
          <CloseOutlined />
        </a>
      </li>
    );
  };

  const listCls = classNames({
    [prefixCls]: true
  });

  let unit = '条';

  return (
    <div className={listCls} style={style}>
      <div className={`${prefixCls}-header`}>
        <span className={`${prefixCls}-header-selected`}>
          <span>
            {dataSource.length} {max ? ` / ${max}` : ''} {unit}
          </span>
          <span className={`${prefixCls}-header-title`}>
            <a
              className={`${prefixCls}-clear-all`}
              onClick={e => handleDeleteItem(e)}
            >
              清空列表
            </a>
          </span>
        </span>
      </div>
      <div className={`${prefixCls}-body`}>
        <div className={`${prefixCls}-body-content`}>
          {!!dataSource.length || (
            <div className={`${prefixCls}-body-content-not-found`}>
              {notFoundContent || '列表为空'}
            </div>
          )}
          {dataSource.map((item, i) => renderItem(i, item[rowKey]))}
        </div>
      </div>
    </div>
  );
};

// static propTypes = {
//   prefixCls: PropTypes.string,
//   dataSource: PropTypes.array,
//   rowKey: PropTypes.string,
//   style: PropTypes.object,
//   render: PropTypes.func,
//   onDeleteItem: PropTypes.func,
//   max: PropTypes.number
// };
export default List;
