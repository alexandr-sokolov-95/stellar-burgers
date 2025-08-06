import { mockFetch } from '../test-utils/mockFetch';
import { fetchFeed, ordersSlice } from '../services/reducers/orders-slice';

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('проверяем санки ordersSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: undefined
  };

  it('должен проверить запрос на размещение заказа в ожидании', () => {
    const action = { type: fetchFeed.pending.type };
    const state = ordersSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });

  it('должен проверить результат успешного запроса на размещение заказа', () => {
    const mockOrdersData = {
      orders: [
        {
          _id: '1',
          ingredients: ['1', '2'],
          status: 'done',
          name: 'Order 1',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          number: 2222
        }
      ],
      total: 100,
      totalToday: 10
    };

    const action = {
      type: fetchFeed.fulfilled.type,
      payload: mockOrdersData
    };
    const state = ordersSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...mockOrdersData,
      loading: false,
      error: undefined
    });
  });

  it('должен проверить результат неуспешного запроса на размещение заказа', () => {
    const errorMessage = 'Failed to fetch orders';

    const action = {
      type: fetchFeed.rejected.type,
      error: { message: errorMessage }
    };
    const state = ordersSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });
});
