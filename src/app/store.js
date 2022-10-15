import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/userSlice';
import userDetailReducer from '../features/user/userDetailSlice';
import globalReducer from '../features/globalSlice';
import loginReducer from '../features/sign/loginSlice';
import registerReducer from '../features/sign/registerSlice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
    counter: counterReducer,
    user: userReducer,
    userDetail: userDetailReducer,
    login: loginReducer,
    register: registerReducer
  },
  // 临时解决redux state序列化
  // https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
