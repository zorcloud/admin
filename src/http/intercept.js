/* 发送前拦截 */
export const requestHandle = config => {
  return config;
};

/* 发送失败拦截 */
export const requestErrorHandle = err => {
  return Promise.reject(err);
};

/* 响应成功拦截 */
export const responseHandle = response => {
  return response;
};

/* 响应失败拦截 */
export const responseErrorHandle = err => {
  return Promise.reject(err);
};
