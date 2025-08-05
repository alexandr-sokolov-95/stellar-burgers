import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingridientsSlice } from './reducers/ingridients-slice';
import { constructorSlice } from './reducers/constructor-slice';
import { ordersSlice } from './reducers/orders-slice';
import { userSlice } from './reducers/user-slice';

const rootReducer = combineSlices(
  ingridientsSlice,
  constructorSlice,
  ordersSlice,
  userSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () => dispatchHook();
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
