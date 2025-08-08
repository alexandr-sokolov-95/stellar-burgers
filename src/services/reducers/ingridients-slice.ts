import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

type TIngridentsState = {
  collection: TIngredient[];
  loading: boolean;
  error: string | undefined;
};

export const fetchIngridients = createAsyncThunk<TIngredient[], undefined>(
  'ingridients/fetchIngridients',
  async function () {
    const data = await getIngredientsApi();
    return data;
  }
);

const initialState: TIngridentsState = {
  collection: [],
  loading: false,
  error: undefined
};

export const ingridientsSlice = createSlice({
  name: 'ingridients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngridients.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchIngridients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.collection = action.payload;
        }
      )
      .addCase(fetchIngridients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
