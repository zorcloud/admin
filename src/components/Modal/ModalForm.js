import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'antd';
import Form from '../Form';
import cx from 'classnames';
import './style/index.less';

const ModalForm = props => {
  const {
    title,
    record,
    className,
    columns,
    onCancel,
    onFinish,
    modalOpts,
    formOpts,
    loading,
    full,
    preview,
    visible: isVisible
  } = props;
  const [visible, setVisible] = useState(false);
  const formRef = useRef();
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  const closeModal = () => {
    if (props.onCancel) {
      props.onCancel();
      return;
    }
    setVisible(false);
  };

  const submit = () => {
    formRef.current
      .validateFields()
      .then(values => {
        onFinish && onFinish(values, record);
      })
      .catch(error => console.log(error));
  };

  const classname = cx(className, 'antui-modalform', { 'full-modal': full });
  const modalProps = {
    className: classname,
    visible: visible,
    style: { top: 20 },
    title: title || (record ? '编辑' : '新增'),
    // maskClosable: true,
    destroyOnClose: true,
    onCancel: closeModal,
    footer: [
      onCancel && (
        <Button key="back" onClick={closeModal}>
          取消
        </Button>
      ),
      onFinish && (
        <Button key="submit" type="primary" onClick={submit} loading={loading}>
          确定
        </Button>
      )
    ],
    ...modalOpts
  };

  const formProps = {
    // ref: formRef,
    onRef: form => (formRef.current = form),
    columns,
    onFinish,
    record,
    preview,
    footer: false,
    formItemLayout: {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 }
    },
    ...formOpts
  };

  return (
    <Modal {...modalProps}>
      <Form {...formProps} />
    </Modal>
  );
};
// static propTypes = {
//   title: PropTypes.string,
//   record: PropTypes.object,
//   visible: PropTypes.bool,
//   columns: PropTypes.array,
//   onCancel: PropTypes.func,
//   onFinish: PropTypes.func,
//   modalOpts: PropTypes.object,
//   formOpts: PropTypes.object,
//   className: PropTypes.string
// };
export default ModalForm;
