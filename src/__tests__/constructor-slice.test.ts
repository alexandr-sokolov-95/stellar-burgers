import { mockFetch } from '../test-utils/mockFetch';
import {
  constructorSlice,
  TConstructorState,
  orderBurger
} from '../services/reducers/constructor-slice';

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Проверяем редьюсер слайса constructor', () => {
  const initialState: TConstructorState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null
  };

  const mockIngredients = [
    {
      id: '1',
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
    },
    {
      id: '2',
      _id: '2',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0
    },
    {
      id: '3',
      _id: '3',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
      __v: 0
    }
  ];

  const initialStateWithIngredients = {
    ...initialState,
    constructorItems: {
      bun: null,
      ingredients: [mockIngredients[1], mockIngredients[2]]
    }
  };

  const mockOrder = {
    _id: 'order1',
    ingredients: ['1', '2', '3'],
    status: 'done',
    name: 'Test Burger',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 1
  };

  describe('синхронные экшены', () => {
    it('должен добавляться ингредиент', () => {
      const mockIngredient = mockIngredients[1];

      const action = constructorSlice.actions.addIngredient(mockIngredient);
      const state = constructorSlice.reducer(initialState, action);

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient);
      expect(state.constructorItems.bun).toBeNull();
    });

    it('должна добавляться булочка', () => {
      const mockBun = mockIngredients[0];

      const action = constructorSlice.actions.addBun(mockBun);
      const state = constructorSlice.reducer(initialState, action);

      expect(state.constructorItems.bun).toEqual(mockBun);
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });

    it('должен удалятся ингредиент', () => {
      const action = constructorSlice.actions.removeIngredient(
        mockIngredients[1].id
      );
      const state = constructorSlice.reducer(
        initialStateWithIngredients,
        action
      );

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredients[2]);
    });

    describe('перемещение ингридиента', () => {
      it('должен переместить ингридиент выше по списку', () => {
        const action = constructorSlice.actions.moveIngredient({
          id: '3',
          direction: 'up'
        });
        const state = constructorSlice.reducer(
          initialStateWithIngredients,
          action
        );

        expect(state.constructorItems.ingredients).toHaveLength(2);
        expect(state.constructorItems.ingredients).toEqual([
          mockIngredients[2],
          mockIngredients[1]
        ]);
      });

      it('должен переместить ингридиент ниже по списку', () => {
        const action = constructorSlice.actions.moveIngredient({
          id: '2',
          direction: 'down'
        });
        const state = constructorSlice.reducer(
          initialStateWithIngredients,
          action
        );

        expect(state.constructorItems.ingredients).toHaveLength(2);
        expect(state.constructorItems.ingredients).toEqual([
          mockIngredients[2],
          mockIngredients[1]
        ]);
      });

      it('не должен переместить первый ингридиент выше по списку', () => {
        const action = constructorSlice.actions.moveIngredient({
          id: '2',
          direction: 'up'
        });
        const state = constructorSlice.reducer(
          initialStateWithIngredients,
          action
        );

        expect(state.constructorItems.ingredients).toEqual(
          initialStateWithIngredients.constructorItems.ingredients
        );
      });

      it('не должен переместить последний ингридиент ниже по списку', () => {
        const action = constructorSlice.actions.moveIngredient({
          id: '3',
          direction: 'down'
        });
        const state = constructorSlice.reducer(
          initialStateWithIngredients,
          action
        );

        expect(state.constructorItems.ingredients).toEqual(
          initialStateWithIngredients.constructorItems.ingredients
        );
      });
    });
  });

  describe('асинхронные экшены', () => {
    it('должен проверить запрос на оформление заказа в ожидании', () => {
      const action = { type: orderBurger.pending.type };
      const state = constructorSlice.reducer(initialState, action);

      expect(state.orderRequest).toBe(true);
    });

    it('должен проверить результат успешного запроса на оформление заказа', () => {
      const action = {
        type: orderBurger.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = constructorSlice.reducer(initialState, action);

      expect(state.orderModalData).toEqual(mockOrder);
      expect(state.orderRequest).toBe(false);
    });

    it('должен проверить результат неуспешного запроса на оформление заказа', () => {
      const action = { type: orderBurger.rejected.type };
      const pendingState = constructorSlice.reducer(initialState, {
        type: orderBurger.pending.type
      });
      const state = constructorSlice.reducer(pendingState, action);

      expect(state.orderRequest).toBe(false);
    });
  });
});
