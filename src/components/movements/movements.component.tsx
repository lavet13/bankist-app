import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';

import {
  selectMovementsIsLoading,
  selectMovementsItems,
} from '../../features/movement/movement.selector';
import {
  fetchMovementCancelled,
  fetchMovementStarted,
} from '../../features/movement/movement.slice';

import { MovementsContainer } from './movements.styles';
import MovementItem from '../movement-item/movement-item.component';

import { selectCurrentUser } from '../../features/user/user.selector';
import Spinner from '../spinner/spinner.component';

const Movements = () => {
  const dispatch = useAppDispatch();
  const movementsItems = useAppSelector(selectMovementsItems);
  const currentUser = useAppSelector(selectCurrentUser);
  const movementsIsLoading = useAppSelector(selectMovementsIsLoading);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchMovementStarted(currentUser.id));
    }

    return () => {
      dispatch(fetchMovementCancelled());
    };
  }, [currentUser]);

  return (
    <MovementsContainer>
      {movementsIsLoading ? (
        <Spinner />
      ) : movementsItems.length ? (
        movementsItems.map((movement, idx) => (
          <MovementItem key={idx} movement={movement} />
        ))
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>История пуста.</p>
      )}
    </MovementsContainer>
  );
};

export default Movements;
