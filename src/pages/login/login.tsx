import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { loginUser } from '../../services/reducers/user-slice';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginUserError } = useAppSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/profile';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Заполните все поля формы');
      return;
    }

    try {
      dispatch(loginUser({ email, password }));
    } catch (error) {
      setError('Ошибка авторизации');
    }
  };

  const errorToDisplay = error || loginUserError || '';

  return (
    <LoginUI
      errorText={errorToDisplay || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
