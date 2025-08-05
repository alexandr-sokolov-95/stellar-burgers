import { FC, memo } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI, Preloader } from '@ui';
import { useAppSelector } from '../../services/store';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const isFeedLoading = useAppSelector((state) => state.orders.loading);
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (isFeedLoading) {
    return <Preloader />;
  }

  return <OrdersListUI orderByDate={orderByDate} />;
});
