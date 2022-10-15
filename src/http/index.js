import {
  requestErrorHandle,
  requestHandle,
  responseErrorHandle,
  responseHandle
} from './intercept';

import axios from 'axios';
import request from './request'

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})

// 封装请求
request(instance)

// 添加拦截
instance.interceptors.request.use(requestHandle, requestErrorHandle);
instance.interceptors.response.use(responseHandle, responseErrorHandle);

export default instance
