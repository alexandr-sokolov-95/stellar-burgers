import { combineSlices } from '@reduxjs/toolkit';
import { ingridientsSlice } from '../services/reducers/ingridients-slice';
import { constructorSlice } from '../services/reducers/constructor-slice';
import { ordersSlice } from '../services/reducers/orders-slice';
import { userSlice } from '../services/reducers/user-slice';
import { mockFetch } from '../test-utils/mockFetch';

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('проверка инициализации rootReducer', () => {
  it('должен успешно комбинировать слайсы', () => {
    const testRootReducer = combineSlices(
      ingridientsSlice,
      constructorSlice,
      ordersSlice,
      userSlice
    );

    const initialState = testRootReducer(undefined, { type: 'unknown' });

    expect(initialState).toEqual({
      [ingridientsSlice.name]: ingridientsSlice.getInitialState(),
      [constructorSlice.name]: constructorSlice.getInitialState(),
      [ordersSlice.name]: ordersSlice.getInitialState(),
      [userSlice.name]: userSlice.getInitialState()
    });
  });
});
