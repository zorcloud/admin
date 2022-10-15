export function toSuccess(mockData, status) {
  return {
    code: 0,
    data: mockData,
    message: 'ok',
    status: true
  };
}

export function toError(message, status) {
  return {
    code: 1,
    message,
    status: false
  };
}

const config = {
  toSuccess,
  toError
};

export default config;
