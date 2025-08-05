import { FC, useEffect, useState } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const { isAuthenticated, data } = useAppSelector((state) => state.user);
  const [name, setName] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setName(data?.name as string);
    } else {
      setName('');
    }
  }, [isAuthenticated, data, name]);

  return <AppHeaderUI userName={name} />;
};
