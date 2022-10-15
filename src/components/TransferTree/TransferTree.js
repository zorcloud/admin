import React, { useEffect, useRef, useState } from 'react';
import List from './List';
import ListTree from './ListTree';
import { RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './style/index.less';

function noop() {}

const TransferTree = props => {
  const {
    prefixCls = 'antui-transfer-tree',
    titleText = '源列表',
    showSearch = false,
    notFoundContent,
    treeKey = 'key',
    treeTitleKey = 'title',
    searchPlaceholder,
    footer = noop,
    listStyle,
    className,
    listRender,
    treeRender,
    loadData,
    loading = false,
    asyncSearch,
    max,
    dataSource = [],
    onChange = noop
  } = props;

  const [leftFilter, setLeftFilter] = useState('');
  const [rightFilter, setRightFilter] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(
    props.targetNodes
      ? props.targetNodes.map(node => node[props.treeKey])
      : null
  );
  const [targetNodes, setTargetNodes] = useState(props.targetNodes);
  const [data, setData] = useState(dataSource);

  const flatTreeDataRef = useRef(
    props.showSearch ? getFlatTreeData(dataSource) : []
  );

  if (props.showSearch) {
    flatTreeDataRef.current = getFlatTreeData(dataSource);
  }

  function getFlatTreeData(treeData) {
    let data = [];
    treeData.forEach(item => {
      if (item.children) {
        data = data.concat(getFlatTreeData(item.children));
      } else {
        data.push(item);
      }
    });
    return data;
  }

  useEffect(() => {
    if (props.targetNodes) {
      setTargetNodes(props.targetNodes);
      setSelectedKeys(props.targetNodes.map(node => node[treeKey]));
    }
    if (dataSource) {
      setData(dataSource);
    }
    if (props.showSearch) {
      flatTreeDataRef.current = getFlatTreeData(dataSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.targetNodes, dataSource]);

  const handleLeftFilter = v => setLeftFilter(v);
  const handleRightFilter = v => setRightFilter(v);

  const handleRightClear = () => setRightFilter('');
  const handleDeleteItem = nodes => {
    const values = targetNodes.filter(
      node => !nodes.some(item => item[treeKey] === node[treeKey])
    );
    const targetKeys = values.map(node => node[treeKey]);

    setSelectedKeys(targetKeys);
    setTargetNodes(values);

    onChange && onChange(targetKeys, values);
  };

  const onTreeSelected = selectedNodes => {
    const targetKeys = selectedNodes.map(node => node[treeKey]);

    if (max && selectedNodes.length > max) {
      console.error('error, selected number > max');
      onChange && onChange(targetKeys, targetNodes, 'OutOfMaxSize');
      return;
    }

    setSelectedKeys(targetKeys);
    setTargetNodes(selectedNodes);

    onChange && onChange(targetKeys, selectedNodes);
  };

  const cls = classNames({
    [className]: !!className,
    [prefixCls]: true
  });

  return (
    <div className={cls}>
      <ListTree
        titleText={titleText}
        loadData={loadData}
        asyncSearch={asyncSearch}
        treeData={data}
        flatTreeData={flatTreeDataRef.current}
        selectedKeys={selectedKeys}
        selectedNodes={targetNodes}
        treeKey={treeKey}
        treeTitleKey={treeTitleKey}
        render={treeRender}
        style={listStyle}
        filter={leftFilter}
        handleFilter={handleLeftFilter}
        onTreeSelected={onTreeSelected}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
        notFoundContent={notFoundContent}
        footer={footer}
        prefixCls={`${prefixCls}-list`}
        loading={loading}
      />
      <div className={`${prefixCls}-operation`}>
        <RightOutlined />
      </div>
      <List
        filter={rightFilter}
        dataSource={targetNodes}
        style={listStyle}
        onDeleteItem={handleDeleteItem}
        render={listRender}
        notFoundContent={notFoundContent}
        prefixCls={`${prefixCls}-list`}
        max={max}
      />
    </div>
  );
};

// static propTypes = {
//   prefixCls: PropTypes.string,
//   dataSource: PropTypes.array,
//   targetNodes: PropTypes.array,
//   onChange: PropTypes.func,
//   listStyle: PropTypes.object,
//   listRender: PropTypes.func,
//   treeKey: PropTypes.string,
//   treeTitleKey: PropTypes.string,
//   className: PropTypes.string,
//   titleText: PropTypes.string,
//   showSearch: PropTypes.bool,
//   searchPlaceholder: PropTypes.string,
//   notFoundContent: PropTypes.node,
//   footer: PropTypes.func,
//   treeRender: PropTypes.func,
//   loadData: PropTypes.func,
//   loading: PropTypes.bool,
//   asyncSearch: PropTypes.func,
//   max: PropTypes.number
// };

export default TransferTree;
