import './index.less';

import React, { useState, useEffect } from 'react';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Button } from 'antd';
import Toolbar from '@/components/Toolbar';
import SearchBar from '@/components/SearchBar';
import DataTable from '@/components/DataTable';
import { ModalForm } from '@/components/Modal';
import createColumns from './columns';

import useBase from '@/hooks/useBase';

import {
  remove,
  save,
  getPageInfo,
  selectUser
} from '@/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const { Content, Header, Footer } = Layout;
const Pagination = DataTable.Pagination;

// @connect(({ crud, loading }) => ({
//   crud,
//   loading: loading.models.crud
// }))
const User = props => {
  const user = useSelector(selectUser);
  const { isLoading: loading, pageData, employees } = user;

  // const [record, setRecord] = useState(null);
  // const [visible, setVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const base = useBase({ handleDelete });
  const { record, visible, setState, onAdd, onDelete } = base;

  useEffect(() => {
    dispatch(
      getPageInfo({
        pageData: pageData.startPage(1, 10)
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDelete(records) {
    dispatch(
      remove({
        records,
        success: () => {
          // 如果操作成功，在已选择的行中，排除删除的行
          setRows(
            rows.filter(item => !records.some(jtem => jtem.id === item.id))
          );
        }
      })
    );
  }

  const columns = createColumns(base, employees);

  const searchBarProps = {
    columns,
    onSearch: values => {
      dispatch(
        getPageInfo({
          pageData: pageData.filter(values).jumpPage(1, 10)
        })
      );
    }
  };

  const dataTableProps = {
    loading,
    columns,
    rowKey: 'id',
    dataItems: pageData,
    selectType: 'checkbox',
    showNum: true,
    isScroll: true,
    selectedRowKeys: rows ? rows.map(item => item.id) : [],
    onChange: ({ pageNum, pageSize }) => {
      dispatch(
        getPageInfo({
          pageData: pageData.jumpPage(pageNum, pageSize)
        })
      );
    },
    onSelect: (keys, rows) => setRows(rows)
  };

  const modalFormProps = {
    loading,
    record,
    visible,
    columns,
    modalOpts: {
      width: 700
    },
    onCancel: () => {
      setState({
        record: null,
        visible: false
      });
    },
    // 新增、修改都会进到这个方法中，
    // 可以使用主键或是否有record来区分状态
    onFinish: values => {
      dispatch(
        save({
          values,
          success: () => {
            setState({
              record: null,
              visible: false
            });
          }
        })
      );
    }
  };

  return (
    <Layout className="full-layout crud-page">
      <Header>
        <Toolbar
          appendLeft={
            <Button.Group>
              <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                新增
              </Button>
              <Button
                disabled={!rows || !rows.length}
                onClick={e => onDelete(rows)}
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Button.Group>
          }
          pullDown={<SearchBar key={1} type="grid" {...searchBarProps} />}
        >
          <SearchBar key={2} group="abc" {...searchBarProps} />
        </Toolbar>
      </Header>
      <Content>
        <DataTable {...dataTableProps} />
      </Content>
      <Footer>
        <Pagination {...dataTableProps} />
      </Footer>
      <ModalForm {...modalFormProps} />
    </Layout>
  );
};

export default User;
