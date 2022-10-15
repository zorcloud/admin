import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http from '@/http';
import PageInfo from './pageHelper/PageInfo';
import config from '@/config';
import { isArray, isObject, isFunction, randomStr } from '.';

/**
 * 如果单纯想改变一个状态可以在页面中用这个action
 * dispatch({
 *   type: 'crud/@change',
 *   payload: {
 *     showModal: true,
 *   },
 *   success: () => {
 *     console.log('state updated!')
 *   }
 * })
 */

/**
 * 封装service中的异步方法，如在model中使用
   const url = '/getPageList';
   const pageInfo = yield call(asyncRequest, {...payload, url});
   yield put({
     type: 'getPageListSuccess',
     payload: pageInfo
   });
 * @param {*} payload
 */
export async function asyncRequest(payload) {
  if (!payload || !payload.url)
    throw new Error('payload require contains url opt');
  /**
   * other中可以配置 method headers data 等参数
   */
  const { url, pageInfo, ...other } = payload;

  // 如果是分页查询 (格式化发送参数)
  if (pageInfo && pageInfo instanceof PageInfo) {
    const { pageNum, pageSize, filters, sorts } = pageInfo;
    let data = { pageNum, pageSize, filters, sorts };

    if (isFunction(config.pageHelper.requestFormat)) {
      data = config.pageHelper.requestFormat(pageInfo);
    }
    other.data = data;
  }
  const _promise = other.method
    ? http[other.method.toLowerCase() + 'Async'](url, other.data, other)
    : http.postAsync(url, other.data, other);

  // 如果是分页查询（格式化反回结果）
  if (pageInfo && pageInfo instanceof PageInfo) {
    return _promise.then(resp => {
      if (isFunction(config.pageHelper.responseFormat)) {
        const newPageInfo = config.pageHelper.responseFormat(resp);
        // 生成新实例，防止新老指向同一个实例问题
        return Object.assign(new PageInfo(), pageInfo, newPageInfo);
      }
    });
  } else {
    return _promise;
  }
}

export const simpleModel = {
  name: randomStr(4),
  enhance: true,
  initialState: { isLoading: false },
  reducers: {},
  extraReducers: {}
};

/**
 * payload 如果传入数组形式的payload，会合并结果后调用一次渲染
 * success 在dispatch结束后得到成功的回调
 * error 在dispatch结束后得到失败的回调
 * afterResponse 模拟reduce中的操作，可以让我们有机会处理反回的数据，不能有副作用的方法
 */
export const _createRequest =
  ({ request_success, request_error, change_success, switchLoading }) =>
  ({ payload, afterResponse, success, error }) =>
  async (dispatch, getState) => {
    await dispatch(switchLoading(true));
    let _payloads = [];
    if (isObject(payload)) {
      _payloads.push(payload);
    } else if (isArray(payload)) {
      _payloads = payload;
    }

    const resultState = {
      success: {},
      error: {}
    };

    for (let i = 0; i < _payloads.length; i++) {
      /**
       * valueField: 返回结果将使用valueField字段的值来接收
       * notice: 弹出通知
       * actionType: 如果存在actionType, 则表示自已处理reducer,值为 actionType + ('_SUCCESS' | '_ERROR')
       */
      const { valueField, notice, actionType, ...otherPayload } = _payloads[i];
      try {
        let response = await asyncRequest(otherPayload);

        // 自已处理反回的数据，模拟reduce中的操作，这里不要写有副作用的函数
        if (isFunction(afterResponse)) {
          let _r = afterResponse(response);
          if (_r) response = _r;
        }

        // 如果需要回调
        if (otherPayload.success) {
          otherPayload.success(response);
        }

        // 如果需要通知功能
        if (notice) {
          config.notice.success(notice === true ? '操作成功' : notice[0]);
        }

        // 如果存在actionType,则表示自已处理reducer
        if (actionType) {
          dispatch(`${actionType}_success`(response));
        } else {
          // 准备返回值
          resultState.success[valueField || '_@fake_'] = response;
        }
      } catch (e) {
        resultState.error['error'] = e;

        // 如果需要内部回调
        if (isFunction(otherPayload.error)) {
          otherPayload.error(e);
        } else if (isFunction(error)) {
          error(e);
        }
        // 通知reducer 如果存在actionType,则表示自已处理reducer
        dispatch(
          `${actionType ? `${actionType}_error` : request_error}`(
            resultState.error
          )
        );
        // 如果出错提前终止
        break;
      }
    }

    // 通知reducer
    if (Object.keys(resultState.success).length) {
      // 如果需要回调
      if (isFunction(success)) {
        success(resultState.success);
      }
      dispatch(request_success(resultState.success));
    }
    dispatch(switchLoading(false));
  };

export const _createChange =
  ({ request_success, request_error, change_success, switchLoading }) =>
  ({ payload, afterResponse, success, error }) =>
  async (dispatch, getState) => {
    await dispatch(switchLoading(true));
    await dispatch(change_success(payload));

    if (isFunction(success)) {
      success();
    }
    dispatch(switchLoading(false));
  };

const modelEnhance = model => {
  const { name, initialState, extraReducers, reducers, enhance } = {
    ...simpleModel,
    ...model
  };

  if (!enhance) {
    return {
      slice: createSlice({ name, initialState, reducers, extraReducers })
    };
  }
  const slice = createSlice({
    name,
    initialState,

    reducers: {
      // get old reducers
      // append new request reducers
      request_success: _changeState,
      request_error: _changeState,
      change_success: _changeState,
      switchLoading: _switchLoading,
      ...reducers
    }
  });
  const { request_success, request_error, change_success, switchLoading } =
    slice.actions;
  const request = _createRequest({
    request_success,
    request_error,
    change_success,
    switchLoading
  });
  const change = _createChange({
    request_success,
    request_error,
    change_success,
    switchLoading
  });

  return {
    slice,
    request,
    change
  };
};

export default modelEnhance;

const _changeState = (state, { payload }) => Object.assign(state, payload);
const _switchLoading = (state, { payload }) =>
  Object.assign(state, { isLoading: payload });

// export const _request = createAsyncThunk(
//   'user/request',
//   async (payload, thunkAPI) => {
//     return _createRequest(payload, thunkAPI, {
//       _request_success,
//       _request_error,
//       _change_success
//     });
//   }
// );

// export const _change = createAsyncThunk(
//   'user/change',
//   async (payload, thunkAPI) => {
//     return _createChange(payload, thunkAPI, {
//       _request_success,
//       _request_error,
//       _change_success
//     });
//   }
// );

// extraReducers: builder => {
//   builder
//     .addCase(_request.pending, state => {
//       state.isLoading = true;
//     })
//     .addCase(_request.fulfilled, (state, action) => {
//       state.isLoading = false;
//     })
//     .addCase(_request.rejected, (state, action) => {
//       state.isLoading = false;
//     })
//     .addCase(_change.pending, (state, action) => {
//       state.isLoading = true;
//     })
//     .addCase(_change.fulfilled, (state, action) => {
//       state.isLoading = false;
//     })
//     .addCase(_change.rejected, (state, action) => {
//       state.isLoading = false;
//     });
// }
