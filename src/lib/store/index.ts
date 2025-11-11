import { configureStore } from '@reduxjs/toolkit';
import sermonsReducer from './slices/sermonsSlice';

export const store = configureStore({
  reducer: {
    sermons: sermonsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
