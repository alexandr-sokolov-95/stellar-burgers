import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeed } from '../../services/reducers/orders-slice';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const orders: TOrder[] = useAppSelector((state) => state.orders.orders);
  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
