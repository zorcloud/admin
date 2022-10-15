import { toError, toSuccess } from '../utils/config';
import utils, { isFunction, isObject, regUrl } from '../utils';

import Mock from 'mockjs';

function handleMockUrl(key) {
  const [firstValue, secondValue] = key.split(' ');
  let methods, url;
  if (firstValue) {
    methods = secondValue ? firstValue : 'POST';
    url = secondValue || firstValue;
    // get 匹配查询参数
    /* if (url.indexOf('regexp:') !== -1) {
      url = regUrl(url.substring(7));
    } */
    return [methods.toLowerCase(), regUrl(url)];
  } else {
    throw new Error('mock文件配置格式错误');
  }
}

export default function packMock(...mocks) {
  // mock 文件返回一个的二维数组 记录 mock 参数
  let mockConfigs = [];
  mocks.forEach(m => {
    if (isFunction(m)) {
      mockConfigs = m({ toSuccess, toError, mock: Mock.mock });
    } else if (isObject(m)) {
      mockConfigs = m;
    } else {
      throw new Error('mock文件必须返回一个函数或对象');
    }
    for (const key in mockConfigs) {
      const [methods, url] = handleMockUrl(key);
      // console.log(url, methods);
      Mock.mock(url, methods, mockConfigs[key]);
    }
  });
}
