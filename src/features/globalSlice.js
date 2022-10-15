import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import request from '@/http';

const initialState = {
  menu: [],
  flatMenu: []
};

export const selectGlobal = state => state.global;

export const getMenu = createAsyncThunk('global/menu', async amount => {
  const response = await request.postAsync('/api/user/menu', { a: 1 });
  const loopMenu = (menu, pitem = {}) => {
    menu.forEach(item => {
      if (pitem.path) {
        item.parentPath = pitem.parentPath
          ? pitem.parentPath.concat(pitem.path)
          : [pitem.path];
      }
      if (item.children && item.children.length) {
        loopMenu(item.children, item);
      }
    });
  };
  loopMenu(response.data);
  return response.data;
});

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {},
  // .addCase(getMenu.pending, state => {})
  extraReducers: builder => {
    builder.addCase(getMenu.fulfilled, (state, { payload }) => {
      console.log('payload', payload);
      state.menu = payload;
      state.flatMenu = getFlatMenu(payload);
    });
  }
});

export function getFlatMenu(menus) {
  let menu = [];
  menus.forEach(item => {
    if (item.children) {
      menu = menu.concat(getFlatMenu(item.children));
    }
    menu.push(item);
  });
  return menu;
}

// export const { } = globalSlice.actions;

export default globalSlice.reducer;
