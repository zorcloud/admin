import React from 'react';
import { Upload } from 'antd';
import config from '@/config';
import { isFunction, isObject } from '@/utils';
// 从全局配置里获取参数
const request = config.request || {};

/**
 * 使Upload可以走全局代理，并可携带全局头部信息
 */
const Index = props => {
  const { headers, action, ...otherProps } = props;

  let newheaders = { ...headers };

  const uploadProps = { ...otherProps };

  if (request && request.withHeaders) {
    if (isFunction(request.withHeaders)) {
      newheaders = { ...request.withHeaders(), ...newheaders };
    } else if (isObject(request.withHeaders)) {
      newheaders = { ...request.withHeaders, ...newheaders };
    }
    uploadProps.headers = newheaders;
  }

  let nextURL = (request.prefix || '') + action;
  if (/^(http|https|ftp):\/\//.test(action)) {
    nextURL = action;
  }

  if (action) {
    uploadProps.action = nextURL;
  }

  return <Upload {...uploadProps} />;
};
export default Index;
