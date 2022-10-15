import { createSlice } from '@reduxjs/toolkit';
import http from '@/http';

const initialState = {
  isLoading: false,
  status: undefined
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    registerHandle(state, { payload }) {
      Object.assign(state, {
        status: payload.status
      });
    },
    switchLoading: (state, { payload }) =>
      Object.assign(state, { isLoading: payload })
  }
});

export const { registerHandle, switchLoading } = registerSlice.actions;

export const submit = payload => async (dispatch, getState) => {
  await dispatch(switchLoading(true));

  const res = await http.postAsync('/user/register', payload);
  await dispatch(registerHandle(res));

  dispatch(switchLoading(false));
};

export default registerSlice.reducer;
