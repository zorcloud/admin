import { createSlice } from '@reduxjs/toolkit';
import http from '@/http';
import config from '@/config';
import { useNavigate } from 'react-router-dom';

const initialState = {
  isLoading: false,
  loggedIn: false,
  message: '',
  user: {}
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginSuccess(state, { payload }) {
      Object.assign(state, {
        loggedIn: true,
        message: '',
        user: payload
      });
    },
    loginError(state, { payload }) {
      config.notice.error(payload.message);
      Object.assign(state, {
        loggedIn: false,
        message: payload.message
      });
    },
    switchLoading: (state, { payload }) =>
      Object.assign(state, { isLoading: payload })
  }
});

export const { loginSuccess, loginError, switchLoading } = loginSlice.actions;

export const login = payload => async (dispatch, getState) => {
  await dispatch(switchLoading(true));
  let isSucceed = false;
  try {
    const res = await http.postAsync('/api/user/login', payload);
    const { status, message, data } = res;
    if (status) {
      localStorage.setItem('user', JSON.stringify(data));
      isSucceed = true;
    } else {
      dispatch(loginError({ message }));
      isSucceed = false;
    }
  } catch (e) {
    dispatch(loginError({ message: e.message }));
    isSucceed = false;
  }
  dispatch(switchLoading(false));
  return isSucceed;
};

export const logout = p => (dispatch, getState) => {};

export default loginSlice.reducer;
