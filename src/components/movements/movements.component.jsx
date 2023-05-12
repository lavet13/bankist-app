import { useEffect } from 'react';
import { useSelector } from 'react-redux';
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

const Movements = () => {
  const dispatch = useDispatch();
  const movementsItems = useSelector(selectMovementsItems);
  const currentUser = useSelector(selectCurrentUser);
  const movementsIsLoading = useSelector(selectMovementsIsLoading);

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
