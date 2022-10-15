import React, { useState } from 'react';
import Search from './Search';
import { Tree, Spin } from 'antd';

function noop() {}

const ListTree = props => {
  const {
    prefixCls,
    loading,
    treeData,
    titleText = '',
    loadData,
    filter,
    showSearch = false,
    style,
    selectedKeys,
    selectedNodes,
    searchPlaceholder,
    notFoundContent,
    dataSource = [],
    treeKey = 'key',
    treeTitleKey = 'title',
    onTreeSelected,
    handleClear: propsHandleClear = noop,
    handleFilter: propsHandleFilter = noop,
    handleSelect: propsHandleSelect = noop,
    handleSelectAll = noop
  } = props;

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchList, setSearchList] = useState([]);

  const handleFilter = value => {
    renderFilterResult(value);
    propsHandleFilter(value);
  };

  const handleClear = () => {
    renderFilterResult('');
    propsHandleFilter('');
  };

  const renderTreeNodes = data => {
    const { render } = props;

    return data.map(item => {
      const treeProps = {
        ...item,
        key: item[treeKey],
        title: render ? render(item) : item[treeTitleKey],
        dataRef: item
      };

      if (item.children) {
        return (
          <Tree.TreeNode {...treeProps}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...treeProps} />;
    });
  };

  const renderFilterResult = filter => {
    const { flatTreeData, treeTitleKey, asyncSearch } = props;
    if (asyncSearch) {
      const promise = asyncSearch(filter);
      if (promise.then) {
        promise.then(listItem => {
          setSearchList(listItem);
        });
      }
    } else {
      setSearchList(
        flatTreeData.filter(item => item[treeTitleKey].indexOf(filter) >= 0)
      );
    }
  };

  const renderSearchItem = searchList => {
    const { render } = props;

    return searchList.map((item, index) => (
      <li
        className="list-comp-item"
        title={item[treeTitleKey]}
        key={item[treeKey]}
        onClick={() => handleSelect({ ...item, dataRef: item })}
      >
        <span className="list-comp-item-body">
          {render ? render(item) : item[treeTitleKey]}
        </span>
      </li>
    ));
  };

  const handleSelect = selectedItem => {
    const { selectedKeys, selectedNodes, treeKey } = props;
    let _selectedNodes = selectedNodes ? [...selectedNodes] : [];

    if (
      selectedKeys &&
      selectedKeys.some(key => key === selectedItem[treeKey])
    ) {
      _selectedNodes = _selectedNodes.filter(
        item => item[treeKey] !== selectedItem[treeKey]
      );
    } else {
      _selectedNodes.push(selectedItem);
    }
    props.onTreeSelected(_selectedNodes);
  };

  const onSelect = (_selectedKeys, info) => {
    if (info.selected && info.node.props.dataRef) {
      if (loadData && !info.node.props.dataRef.isLeaf) {
        return;
      } else if (
        info.node.props.dataRef.children &&
        info.node.props.dataRef.children.length
      ) {
        onExpand([info.node.props.eventKey], info);
        return;
      }
    }

    let targetNodes = info.selectedNodes.map(node => ({
      [treeKey]: node[treeKey],
      [treeTitleKey]: node[treeTitleKey],
      // ...node.props,
      ...node.dataRef
    }));

    // 如果是异步数据需要与老数据进行拼合及去重
    if (loadData) {
      let _selectedNodes = selectedNodes ? [...selectedNodes] : [];
      if (!info.selected) {
        // 如果是取消选择树节点，则先过滤掉
        _selectedNodes = _selectedNodes.filter(
          item => item[treeKey] !== info.node.props.eventKey
        );
      }
      const newNodes = selectedKeys
        ? _selectedNodes.concat(
            targetNodes.filter(item => selectedKeys.indexOf(item[treeKey]) < 0)
          )
        : targetNodes;
      onTreeSelected(newNodes);
    } else {
      onTreeSelected(targetNodes);
    }
  };

  const onExpand = (eKeys, info) => {
    if (info.event && info.node.props.children) {
      let concatKeys = [eKeys, expandedKeys].reduce((prev, next) =>
        prev.filter(item => next.indexOf(item) === -1).concat(next)
      );

      if (expandedKeys.some(item => item === info.node.props.eventKey)) {
        concatKeys = concatKeys.filter(
          item => item !== info.node.props.eventKey
        );
      }
      setExpandedKeys(concatKeys);
      setAutoExpandParent(false);
    } else {
      setExpandedKeys(eKeys);
      setAutoExpandParent(false);
    }
  };

  const showTree = (
    <Tree
      loadData={loadData}
      onSelect={onSelect}
      onExpand={onExpand}
      selectedKeys={selectedKeys || []}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      multiple
    >
      {renderTreeNodes(treeData)}
    </Tree>
  );

  return (
    <div className={prefixCls} style={style}>
      <div className={`${prefixCls}-header tree-title`}>{titleText}</div>
      <div
        className={
          showSearch
            ? `${prefixCls}-body ${prefixCls}-body-with-search`
            : `${prefixCls}-body`
        }
      >
        {showSearch ? (
          <div className={`${prefixCls}-body-search-wrapper`}>
            <Search
              prefixCls={`${prefixCls}-search`}
              onChange={handleFilter}
              handleClear={handleClear}
              placeholder={searchPlaceholder || '请输入搜索内容'}
            />
          </div>
        ) : null}
        <div className={`${prefixCls}-body-content tree-content`}>
          {filter ? (
            <ul className="tree-filter-result">
              {renderSearchItem(searchList)}
            </ul>
          ) : null}
          {treeData.length ? (
            showTree
          ) : (
            <div className={`${prefixCls}-body-content-not-found`}>
              {loading ? (
                <Spin spinning={loading} />
              ) : (
                notFoundContent || '列表为空'
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// static propTypes = {
//   prefixCls: PropTypes.string,
//   treeData: PropTypes.array,
//   selectedKeys: PropTypes.array,
//   showSearch: PropTypes.bool,
//   searchPlaceholder: PropTypes.string,
//   titleText: PropTypes.string,
//   treeKey: PropTypes.string,
//   treeTitleKey: PropTypes.string,
//   style: PropTypes.object,
//   handleClear: PropTypes.func,
//   notFoundContent: PropTypes.string,
//   filter: PropTypes.string,
//   handleFilter: PropTypes.func,
//   render: PropTypes.func,
//   loading: PropTypes.bool,
//   flatTreeData: PropTypes.array
// };

export default ListTree;
