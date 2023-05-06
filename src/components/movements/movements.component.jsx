import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { selectMovementsItems } from '../../store/movement/movement.selector';
import { setMovements } from '../../store/movement/movement.action';

import { MovementsContainer } from './movements.styles';
import MovementItem from '../movement-item/movement-item.component';

import { onMovementChangeListener } from '../../utils/firebase/firebase.utils';
import { selectCurrentUser } from '../../store/user/user.selector';
import Spinner from '../spinner/spinner.component';

const Movements = () => {
  const dispatch = useDispatch();
  const movementsItems = useSelector(selectMovementsItems);
  const currentUser = useSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const unsub = onMovementChangeListener(currentUser, querySnapshot => {
        const movementItems = querySnapshot.docs.map(docSnapshot =>
          docSnapshot.data()
        );

        dispatch(setMovements(movementItems));
      });
      setIsLoading(false);

      return unsub;
    }

    setIsLoading(false);
  }, [currentUser]);

  return (
    <MovementsContainer>
      {isLoading ? (
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
