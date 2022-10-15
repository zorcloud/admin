import React, { useState } from 'react';
import { Modal } from 'antd';
import config from '@/config';
import { isArray } from '../utils';

const useBase = props => {
  const [record, setRecord] = useState(null);
  const [visible, setVisible] = useState(false);

  const notice = config.notice; // 消息通知

  const setState = state => {
    setRecord(state.record);
    setVisible(state.visible);
  };

  /**
   * 新增
   */
  const onAdd = () => {
    setRecord(null);
    setVisible(true);
  };

  /**
   * 修改
   * @param {object} 表单记录
   */
  const onUpdate = record => {
    setRecord(record);
    setVisible(true);
  };

  /**
   * 删除
   * @param {object | array} 表单记录, 批量删除时为数组
   */
  const onDelete = record => {
    if (!record) return;
    if (isArray(record) && !record.length) return;

    const content = `您是否要删除这${isArray(record) ? record.length : ''}项？`;

    Modal.confirm({
      title: '注意',
      content,
      onOk: () => {
        props.handleDelete &&
          props.handleDelete(isArray(record) ? record : [record]);
      },
      onCancel() {}
    });
  };

  const handleAdd = () => {
    /* 子类重写 */
  };
  const handleUpdate = () => {
    /* 子类重写 */
  };
  const handleDelete = records => {
    /* 子类重写 */
  };

  return { record, visible, setState, onAdd, onUpdate, onDelete, notice };
};

export default useBase;
