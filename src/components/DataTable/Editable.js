import React, { useEffect, useRef } from 'react';
// import { Form } from '@ant-design/compatible';
// import '@ant-design/compatible/assets/index.css';
import { Form } from 'antd';
import omit from 'object.omit';
import DataTable, { Oper } from './DataTable';

const EditableContext = React.createContext();

const Editable = {};
// const Editable = Form.create()(({ form, ...props }) => (
//   <EditableContext.Provider value={form}>
//     <DataTable {...props} />
//   </EditableContext.Provider>
// ));

/**
 * 重新包装的Oper为了传递form到子组件
 * 例如
 *  <EditableOper>
      {
        form => <a onClick={e => onSave(form)}>保存</a>
      }
    </EditableOper>
 */
const EditableOper = props => (
  <EditableContext.Consumer>
    {form => <Oper>{props.children(form)}</Oper>}
  </EditableContext.Consumer>
);

/**
 * 可编辑元件
 * 通过返回一个组件来改变当前表格Cell的展现方式
 * @param text 当前cell里的文本内容
 * @param record [Object] 包含当前cell的一行数据
 * @param field [Object] columns里的这一列
 * @param field.tableItem.editing [Function] 使用函数可以支持满足条件的指定单元格应用类型
 */
const EditableCell = props => {
  const { record, text, field } = props;
  const { tableItem } = field;
  const { type } = tableItem;

  const fromRef = useRef();

  useEffect(() => {
    // 重置表单项，否则会带入值到下一行
    if (record && record[field.name]) {
      fromRef.current.setFieldsValue({
        [field.name]: record[field.name]
      });
    }
  });

  return (
    <EditableContext.Consumer>
      {form => {
        if (!form) {
          console.warn('Please use Editable instead of DataTable');
          return text;
        }
        if (!fromRef.current) fromRef.current = form;
        let formProps = {
          form,
          name: field.name,
          title: field.title,
          record,
          ...tableItem
        };
        if (field.dict) {
          formProps.dict = field.dict;
        }
        formProps = omit(formProps, ['editing', 'render']);
        const FieldComp =
          require(`../Form/model/${type.toLowerCase()}`).default(formProps);
        const [FieldCompName, FieldCompVerify, FieldCompElement] = FieldComp;
        return (
          <Form.Item
            help={false}
            className="editable-form-item"
            name={FieldCompName}
            {...FieldCompVerify}
          >
            {FieldCompElement ? FieldCompElement : FieldComp}
          </Form.Item>
        );
      }}
    </EditableContext.Consumer>
  );
};

export { Editable, EditableCell, EditableOper };
