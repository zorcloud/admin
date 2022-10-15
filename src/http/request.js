import { useDispatch } from 'react-redux';
import utils from '../utils';

export default function request(instance) {
  // test?name=jojo
  instance.getAsync = function (url, params, isSave, reducer) {
    return new Promise(function (resolve, reject) {
      instance
        .get(url.split('_')[0], {
          params: params
        })
        .then(
          response => {
            const retData = response.data;
            const orginalData = retData.data;
            isSave &&
              utils.isFunction(reducer) &&
              useDispatch(reducer(orginalData));
            resolve(retData);
          },
          error => {
            handleError(error, reject);
          }
        );
    });
  };

  // test/{id}
  instance.getAsyncWithConcat = function (url, params, isSave, reducer) {
    return new Promise(function (resolve, reject) {
      instance.get(utils.concatUrlRequestPath(url.split('_')[0], params)).then(
        response => {
          const retData = response.data;
          const orginalData = retData.data;
          isSave &&
            utils.isFunction(reducer) &&
            useDispatch(reducer(orginalData));
          resolve(retData);
        },
        error => {
          handleError(error, reject);
        }
      );
    });
  };

  // test/{id}?name=jojo
  instance.getAsyncWithConcatMix = function (
    url,
    { params, paths },
    isSave,
    reducer
  ) {
    return new Promise(function (resolve, reject) {
      instance
        .get(utils.concatUrlRequestPath(url.split('_')[0], paths), {
          params
        })
        .then(
          response => {
            const retData = response.data;
            const orginalData = retData.data;
            isSave &&
              utils.isFunction(reducer) &&
              useDispatch(reducer(orginalData));
            resolve(retData);
          },
          error => {
            handleError(error, reject);
          }
        );
    });
  };

  instance.deleteAsync = function (url, params) {
    return new Promise(function (resolve, reject) {
      instance
        .delete(url.split('_')[0], {
          params: params
        })
        .then(
          response => {
            const retData = response.data;
            resolve(retData);
          },
          error => {
            handleError(error, reject);
          }
        );
    });
  };

  instance.deleteAsyncWithConcat = function (url, params) {
    return new Promise(function (resolve, reject) {
      instance
        .delete(utils.concatUrlRequestPath(url.split('_')[0], params))
        .then(
          response => {
            const retData = response.data;
            resolve(retData);
          },
          error => {
            handleError(error, reject);
          }
        );
    });
  };

  instance.postAsync = function (url, data, config = {}) {
    return new Promise(function (resolve, reject) {
      instance.post(url.split('_')[0], data, config).then(
        response => {
          const retData = response.data;
          resolve(retData);
        },
        error => {
          handleError(error, reject);
        }
      );
    });
  };

  // post请求 数据保留在redux里面
  instance.postCommitAsync = function (url, data, reducer, config = {}) {
    return new Promise(function (resolve, reject) {
      instance.post(url.split('_')[0], data, config).then(
        response => {
          const retData = response.data;
          const orginalData = retData.data;
          utils.isFunction(reducer) && useDispatch(reducer(orginalData));
          resolve(retData);
        },
        error => {
          handleError(error, reject);
        }
      );
    });
  };

  instance.postFormDataAsync = function (url, data, config = {}) {
    data = utils.objectToFormData(data);
    return new Promise(function (resolve, reject) {
      instance.post(url.split('_')[0], data, config).then(
        response => {
          const retData = response.data;
          resolve(retData);
        },
        error => {
          handleError(error, reject);
        }
      );
    });
  };

  instance.putAsync = function (url, data, config = {}) {
    return new Promise(function (resolve, reject) {
      instance.put(url.split('_')[0], data, config).then(
        response => {
          const retData = response.data;
          resolve(retData);
        },
        error => {
          handleError(error, reject);
        }
      );
    });
  };

  instance.putAsyncWithConcat = function (url, data, config = {}) {
    return new Promise(function (resolve, reject) {
      instance
        .put(utils.concatUrlRequestPath(url.split('_')[0], data), config)
        .then(
          response => {
            const retData = response.data;
            resolve(retData);
          },
          error => {
            handleError(error, reject);
          }
        );
    });
  };

  instance.putFormDataAsync = function (url, data, config = {}) {
    data = utils.objectToFormData(data);
    return new Promise(function (resolve, reject) {
      instance.put(url.split('_')[0], data, config).then(
        response => {
          const retData = response.data;
          resolve(retData);
        },
        error => {
          handleError(error, reject);
        }
      );
    });
  };

  instance.patchAsync = function (url, data, config = {}) {
    return new Promise(function (resolve, reject) {
      instance.patch(url.split('_')[0], data, config).then(
        response => {
          const retData = response.data;
          resolve(retData);
        },
        error => {
          handleError(error, reject);
        }
      );
    });
  };
}

function handleError(error, reject) {
  console.log(error);
  if (error.response.data && error.response.data.message) {
    reject(error.response.data.message);
  } else {
    reject(error);
  }
}
