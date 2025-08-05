import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  getUserRequest: boolean;
  getUserError: string | undefined;
  loginUserError: string | undefined;
  loginUserRequest: boolean;
  logoutUserError: string | undefined;
  logoutUserRequest: boolean;
  data: TUser | undefined;
  orders: TOrder[];
  ordersUserError: string | undefined;
  ordersUserRequest: boolean;
  updateUserError: string | undefined;
  updateUserRequest: boolean;
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    try {
      const data = await loginUserApi({ email, password });
      if (!data?.success) {
        return rejectWithValue(data);
      }
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      if (data?.success) {
        return data;
      }
      return rejectWithValue(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user);
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await logoutApi();
      if (!data?.success) {
        return rejectWithValue(data);
      }
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return data;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const getOrders = createAsyncThunk('user/getOrders', async () => {
  try {
    const data = await getOrdersApi();
    return data;
  } catch (error) {
    return error;
  }
});

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  getUserRequest: false,
  getUserError: undefined,
  loginUserError: undefined,
  loginUserRequest: false,
  logoutUserError: undefined,
  logoutUserRequest: false,
  updateUserError: undefined,
  updateUserRequest: false,
  data: undefined,
  orders: [],
  ordersUserError: undefined,
  ordersUserRequest: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserError = undefined;
        state.loginUserRequest = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = undefined;
        state.data = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        if (action.payload) {
          const payload = action.payload as {
            success: boolean;
            message: string;
          };
          state.loginUserError = payload.message;
        }
        state.isAuthenticated = false;
      })
      .addCase(getUser.pending, (state) => {
        state.getUserError = undefined;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload?.user;
        state.isAuthenticated = true;
        state.getUserError = undefined;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.getUserError = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutUserRequest = true;
        state.logoutUserError = undefined;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = undefined;
        state.isAuthenticated = false;
        state.logoutUserRequest = false;
        state.logoutUserError = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutUserRequest = false;
        state.logoutUserError = action.payload as string;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload as TOrder[];
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.updateUserRequest = false;
        state.updateUserError = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError = action.payload as string;
      });
  }
});

export const { setAuthChecked } = userSlice.actions;
