import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  clearOrder,
  orderBurger
} from '../../services/reducers/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const { constructorItems, orderRequest, orderModalData } = useAppSelector(
    (state) => state.burgerConstructor
  );
  const { isAuthenticated } = useAppSelector((state) => state.user);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((el) => el._id)
    ];

    dispatch(orderBurger(orderData));
  };
  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
