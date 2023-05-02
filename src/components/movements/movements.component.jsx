import { MovementsContainer } from './movements.styles';
import MovementItem from '../movement-item/movement-item.component';

const Movements = () => {
  return (
    <MovementsContainer>
      <MovementItem
        movement={{ type: 'deposit', date: new Date().getDate(), value: 11 }}
      />
    </MovementsContainer>
  );
};

export default Movements;
