import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import PageHelper from '@/utils/pageHelper';
import modelEnhance from '@/utils/modelEnhance';

const initialState = {
  isLoading: false,
  pageData: PageHelper.create(),
  employees: []
};

export const {
  slice: userSlice,
  request,
  change
} = modelEnhance({
  name: 'user',
  initialState,
  reducers: {}
});

// export const { request_success, request_error, change_success } =
//   userSlice.actions;

export const selectUser = state => state.user;

// 获取员工列表
export const getEmployees = payload => async (dispatch, getState) => {
  dispatch(
    request({
      payload: {
        valueField: 'employees',
        url: '/api/crud/getWorkEmployee'
      },
      afterResponse: resp => resp.data
    })
  );
};

export const getPageInfo = payload => async (dispatch, getState) => {
  const user = selectUser(getState());
  const { pageData } = payload;
  dispatch(
    request({
      payload: {
        valueField: 'pageData',
        url: '/api/crud/getList',
        pageInfo: pageData
      }
    })
  );
};

// 保存 之后查询分页
export const save =
  ({ values, success }) =>
  async (dispatch, getState) => {
    const { pageData } = selectUser(getState());
    await dispatch(
      request({
        payload: {
          notice: true,
          url: '/api/crud/save',
          data: values
        }
      })
    );
    await dispatch(getPageInfo({ pageData }));
    success();
  };

// 修改
export const update = payload => async (dispatch, getState) => {};

// 删除 之后查询分页
export const remove =
  ({ records, success }) =>
  async (dispatch, getState) => {
    const { pageData } = selectUser(getState());
    await dispatch(
      request({
        payload: {
          notice: true,
          url: '/api/crud/bathDelete',
          data: records.map(item => item.id)
        }
      })
    );
    await dispatch(getPageInfo({ pageData }));
    success();
  };

// 初始化
export const init = payload => async (dispatch, getState) => {
  const { pageData } = selectUser(getState());
  await dispatch(
    getPageInfo({
      pageData: pageData.startPage(1, 10)
    })
  );
  await dispatch(getEmployees());
};

export default userSlice.reducer;
