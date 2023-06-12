import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  selectMovementsIsLoading,
  selectMovementsItems,
} from '../../store/movement/movement.selector';
import { fetchMovementsStart } from '../../store/movement/movement.action';

import { MovementsContainer } from './movements.styles';
import MovementItem from '../movement-item/movement-item.component';

import { selectCurrentUser } from '../../store/user/user.selector';
import Spinner from '../spinner/spinner.component';
import { useAppSelector } from '../../store/store';

const Movements = () => {
  const dispatch = useDispatch();
  const movementsItems = useAppSelector(selectMovementsItems);
  const currentUser = useAppSelector(selectCurrentUser);
  const movementsIsLoading = useAppSelector(selectMovementsIsLoading);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchMovementsStart(currentUser));
    }
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
