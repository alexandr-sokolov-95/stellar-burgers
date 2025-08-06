import { mockFetch } from '../test-utils/mockFetch';
import {
  fetchIngridients,
  ingridientsSlice
} from '../services/reducers/ingridients-slice';

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('проверяем санки ingridientsSlice', () => {
  const initialState = {
    collection: [],
    loading: false,
    error: undefined
  };

  it('состояние loading должно быть true', () => {
    const action = { type: fetchIngridients.pending.type };
    const state = ingridientsSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: undefined
    });
  });

  it('состояние loading должно быть false, коллекция должна заполнится', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      }
    ];

    const action = {
      type: fetchIngridients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingridientsSlice.reducer(initialState, action);

    expect(state).toEqual({
      collection: mockIngredients,
      loading: false,
      error: undefined
    });
  });

  it('состояние loading должно быть false и error должен получить rejected', () => {
    const errorMessage = 'Невозможно получить ингредиенты';

    const action = {
      type: fetchIngridients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingridientsSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });
});
