// 判断是否是function
export function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}

// 判断是否是数组
export function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}

// 判断是否是对象
export function isObject(val) {
  return (
    val !== null && Object.prototype.toString.call(val) === '[object Object]'
  );
}

// 拼接Get请求参数
export function concatUrlRequestPath(url, orginalParam) {
  for (let item in orginalParam) {
    url += '/' + orginalParam[item];
  }
  return url;
}

// FormData 数据格式
export function objectToFormData(object) {
  const formData = new FormData();
  if (Object.prototype.toString.call(object) === '[object Array]') {
    Object.keys(object).forEach(key => {
      Object.keys(object[key]).forEach(key1 => {
        formData.append(key1, object[key][key1]);
      });
    });
  } else {
    Object.keys(object).forEach(key => {
      if (Object.prototype.toString.call(object[key]) === '[object Array]') {
        Object.keys(object[key]).forEach(key1 => {
          formData.append(key, object[key][key1]);
        });
      } else {
        formData.append(key, object[key]);
      }
    });
  }

  return formData;
}
// mock 正则匹配get参数
export function regUrl(url) {
  return RegExp(url + '.*');
}

/**
 * 生成指定位数的随机数
 * @param {int} x
 */
export function randomStr(x) {
  let s = '';
  while (s.length < x && x > 0) {
    const v = Math.random() < 0.5 ? 32 : 0;
    s += String.fromCharCode(
      Math.round(Math.random() * (122 - v - (97 - v)) + (97 - v))
    );
  }
  return s;
}

/**
 * 防反跳。func函数在最后一次调用时刻的wait毫秒之后执行！
 * @param func 执行函数
 * @param wait 时间间隔
 * @param immediate 为true，debounce会在wai 时间间隔的开始调用这个函数
 * @returns {Function}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    const last = new Date().getTime() - timestamp; // timestamp会实时更新

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {
    context = this;
    args = arguments;
    timestamp = new Date().getTime();
    const callNow = immediate && !timeout;

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
}

const utils = {
  isFunction,
  isArray,
  isObject,
  concatUrlRequestPath,
  objectToFormData,
  regUrl,
  randomStr,
  debounce
};

export default utils;
