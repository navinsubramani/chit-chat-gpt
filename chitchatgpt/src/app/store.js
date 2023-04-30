import { configureStore } from '@reduxjs/toolkit';
import chatinterfaceReducer from '../features/chatinterface/chatinterfaceSlice'

export const store = configureStore({
  reducer: {
    chatinterface: chatinterfaceReducer
  },
});
