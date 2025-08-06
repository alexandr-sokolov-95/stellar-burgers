import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

type TConstructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type TConstructorState = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (data: string[], { rejectWithValue }) => {
    try {
      const result = await orderBurgerApi(data);
      if (!result.success) {
        return rejectWithValue(result);
      }
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) => {
      const arr = state.constructorItems.ingredients;
      const index = arr.findIndex((el) => el.id === action.payload.id);
      const element = arr[index];

      state.constructorItems.ingredients.splice(index, 1);

      if (action.payload.direction === 'up') {
        state.constructorItems.ingredients.splice(index - 1, 0, element);
      }

      if (action.payload.direction === 'down') {
        state.constructorItems.ingredients.splice(index + 1, 0, element);
      }
    },
    clearOrder: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearOrder
} = constructorSlice.actions;
