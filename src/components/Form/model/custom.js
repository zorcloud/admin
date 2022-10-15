/**
 * 自定义表单元件,
 * 在column中如果需要用form控制
 *
    return form.getFieldDecorator('xxx')(
      // ...
    );
 */
const func = ({ form, render, record, ...otherProps }) => {
  return render(record, form, otherProps);
};

export default func;
