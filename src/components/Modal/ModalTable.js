import React, { useState, useRef } from 'react';
import { Modal, Button } from 'antd';
import cx from 'classnames';
import LoadTable from '../DataTable/LoadTable';
import SearchBar from '../SearchBar';
import './style/index.less';

const ModalTable = props => {
  const {
    title,
    className,
    columns,
    tableProps,
    modalProps,
    rowKey,
    full,
    width,
    selectType,
    onCancel,
    onOk,
    visible,
    // value,
    loading,
    onSubmit
  } = props;

  const paginationContainerRef = useRef();

  // ?
  const [dataItems, setDataItems] = useState();
  const [value, setValue] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const onChange = () => {};

  const onSearch = (values, isReset) => {
    onChange({
      pageNum: 1,
      pageSize: dataItems.pageSize,
      filters: values
    });
  };

  const ok = () => {
    if (onSubmit) {
      onSubmit(value, selectedRows);
    }
  };

  const classname = cx(className, 'antui-table-modal', 'antui-modalform', {
    'full-modal': full
  });

  const searchBarProps = {
    columns,
    onSearch: onSearch
  };

  const titleComp = title && (
    <div className="with-search-title">
      <div className="left-title">{title}</div>
      <SearchBar {...searchBarProps} />
    </div>
  );

  const _modalProps = {
    className: classname,
    confirmLoading: loading,
    visible,
    width: width || 600,
    style: { top: 20 },
    title: titleComp,
    destroyOnClose: true,
    onCancel: onCancel,
    onOk: ok,
    footer: [
      <div
        key="footer-page"
        className="footer-page"
        ref={paginationContainerRef}
      ></div>,
      <Button key="back" onClick={onCancel}>
        取消
      </Button>,
      onOk && (
        <Button key="submit" type="primary" onClick={ok}>
          确定
        </Button>
      )
    ],
    ...modalProps
  };

  return (
    <Modal {..._modalProps}>
      <LoadTable columns={columns} {...tableProps} />
    </Modal>
  );
};

export default ModalTable;
