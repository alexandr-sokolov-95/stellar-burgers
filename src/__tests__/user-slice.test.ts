import { mockFetch } from '../test-utils/mockFetch';
import { userSlice, loginUser } from '../services/reducers/user-slice';

beforeEach(() => {
  mockFetch();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('проверяем санки userSlice', () => {
  const initialState = {
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

  const mockUser = {
    email: 'test@example.com',
    name: 'User'
  };

  const mockSuccessResponse = {
    success: true,
    user: mockUser,
    accessToken: 'access-token',
    refreshToken: 'refresh-token'
  };

  const mockErrorResponse = {
    success: false,
    message: 'Неверный логин ил пароль'
  };

  it('должен проверить запрос на авторизацию в ожидании', () => {
    const action = { type: loginUser.pending.type };
    const state = userSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loginUserRequest: true,
      loginUserError: undefined
    });
  });

  it('должен проверить результат успешного запроса на авторизацию', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockSuccessResponse
    };
    const state = userSlice.reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loginUserRequest: false,
      loginUserError: undefined,
      data: mockUser,
      isAuthenticated: true
    });
  });

  it('должен проверить результат неуспешного запроса на авторизацию', () => {
    const action = {
      type: loginUser.rejected.type,
      payload: mockErrorResponse
    };
    const pendingState = userSlice.reducer(initialState, {
      type: loginUser.pending.type
    });
    const state = userSlice.reducer(pendingState, action);

    expect(state).toEqual({
      ...initialState,
      loginUserRequest: false,
      loginUserError: 'Неверный логин ил пароль',
      isAuthenticated: false
    });
  });
});
